import { DownOutlined } from '@ant-design/icons'
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Pagination,
  Select,
  Table,
} from 'antd'
import type { FormInstance, TableColumnsType, TableProps } from 'antd'
import { type Dayjs, isDayjs } from 'dayjs'
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'

const { RangePicker } = DatePicker

type Primitive = string | number

export interface Option {
  label: React.ReactNode
  value: Primitive
  children?: Option[]
}

export interface FilterFormItem {
  prop: string
  label: string
  type: 'input' | 'select' | 'date' | 'daterange' | 'number' | 'cascader' | 'checkbox' | 'autocomplete'
  placeholder?: string
  options?: Option[]
  defaultValue?: unknown
  attrs?: Record<string, unknown>
}

export interface FilterTableColumn<T extends Record<string, any> = Record<string, any>> {
  prop: keyof T | string
  label: React.ReactNode
  width?: number | string
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right' | boolean
  sortable?: boolean
  formatter?: (row: T, column: FilterTableColumn<T>, cellValue: unknown) => React.ReactNode
  render?: (row: T, column: FilterTableColumn<T>, index: number) => React.ReactNode
}

export interface FilterTableRef {
  reload: () => void
  reset: () => void
  form: FormInstance
}

export interface FilterTableProps<T extends Record<string, any> = Record<string, any>> {
  columns: Array<FilterTableColumn<T>>
  filterItems?: FilterFormItem[]
  showPagination?: boolean
  pageSize?: number
  pageSizes?: number[]
  data?: T[]
  total?: number
  loading?: boolean
  autoScroll?: boolean
  tableProps?: Omit<TableProps<T>, 'columns' | 'dataSource' | 'loading'>
  selection?: boolean
  selectable?: (row: T) => boolean
  onQuery: (params: Record<string, unknown>) => void | Promise<void>
  renderTableActions?: React.ReactNode
}

// --- Pure utility functions (module-level, no re-creation) ---

function filterEmptyProperties<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      ;(acc as Record<string, unknown>)[key] = value
    }
    return acc
  }, {} as Partial<T>)
}

function normalizeDateValue(value: unknown): unknown {
  if (isDayjs(value))
    return (value as Dayjs).format('YYYY-MM-DD')
  if (Array.isArray(value))
    return value.map(item => (isDayjs(item) ? (item as Dayjs).format('YYYY-MM-DD') : item))
  return value
}

function toAntdColumns<T extends Record<string, any>>(columns: Array<FilterTableColumn<T>>): TableColumnsType<T> {
  return columns.map((col) => {
    const dataIndex = String(col.prop)
    return {
      title: col.label,
      dataIndex,
      key: dataIndex,
      width: col.width,
      align: col.align ?? 'center',
      fixed: col.fixed === true ? 'left' : col.fixed,
      sorter: col.sortable,
      render: (_: unknown, row: T, index: number) => {
        if (col.render)
          return col.render(row, col, index)
        const cellValue = row[dataIndex]
        if (col.formatter)
          return col.formatter(row, col, cellValue)
        return cellValue as React.ReactNode
      },
    }
  })
}

// --- Sub-components extracted to avoid inline component definitions ---

interface FilterControlProps {
  item: FilterFormItem
  onPressEnter: () => void
}

const FilterControl = memo(({ item, onPressEnter }: FilterControlProps) => {
  const common = {
    placeholder: item.placeholder,
    ...(item.attrs ?? {}),
  } as Record<string, unknown>

  switch (item.type) {
    case 'input':
      return <Input allowClear {...common} onPressEnter={onPressEnter} />
    case 'select':
      return <Select allowClear options={item.options} style={{ width: '100%' }} {...common} />
    case 'checkbox':
      return <Checkbox {...common} />
    case 'date':
      return <DatePicker style={{ width: '100%' }} {...common} />
    case 'daterange':
      return <RangePicker style={{ width: '100%' }} {...common} />
    case 'cascader':
      return <Cascader options={item.options} style={{ width: '100%' }} {...common} />
    case 'number':
      return <InputNumber style={{ width: '100%' }} {...common} />
    case 'autocomplete':
      return <AutoComplete options={item.options} style={{ width: '100%' }} {...common} />
    default:
      return <Input allowClear {...common} />
  }
})

FilterControl.displayName = 'FilterControl'

// Static style objects hoisted outside component to prevent recreation on every render
const FORM_GRID_STYLE: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: 16,
}

const FORM_ITEM_STYLE: React.CSSProperties = { marginBottom: 0 }
const LABEL_COL_STYLE = { style: { width: 100, flexShrink: 0 } }
const WRAPPER_COL_STYLE = { style: { flex: 1, minWidth: 0 } }
const PAGINATION_WRAPPER_STYLE: React.CSSProperties = { marginTop: 16, display: 'flex', justifyContent: 'flex-end' }

const DEFAULT_COLLAPSED_ROWS = 2

function InternalFilterTable<T extends Record<string, any>>(
  props: FilterTableProps<T>,
  ref: React.ForwardedRef<FilterTableRef>,
) {
  const {
    columns,
    filterItems = [],
    showPagination = true,
    pageSize = 20,
    pageSizes = [20, 50, 100],
    data = [],
    total = 0,
    loading = false,
    autoScroll = true,
    tableProps,
    selection = false,
    selectable = () => true,
    onQuery,
    renderTableActions,
  } = props

  const [form] = Form.useForm()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(pageSize)
  const [isExpanded, setIsExpanded] = useState(false)
  const formGridRef = useRef<HTMLDivElement>(null)

  const initialValues = useMemo<Record<string, unknown>>(() => {
    return filterItems.reduce<Record<string, unknown>>((acc, item) => {
      acc[item.prop] = item.defaultValue ?? ''
      return acc
    }, {})
  }, [filterItems])

  useEffect(() => {
    form.setFieldsValue(initialValues)
  }, [form, initialValues])

  useEffect(() => {
    void triggerQuery()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const shouldShowExpandButton = filterItems.length > DEFAULT_COLLAPSED_ROWS * 3

  // Use ref to hold latest page/limit to avoid stale closures in callbacks
  const pageRef = useRef(page)
  const limitRef = useRef(limit)
  pageRef.current = page
  limitRef.current = limit

  const triggerQuery = useCallback(async (nextPage = pageRef.current, nextLimit = limitRef.current) => {
    const values = (form.getFieldsValue() ?? {}) as Record<string, unknown>
    const normalizedValues = Object.keys(values).reduce<Record<string, unknown>>((acc, key) => {
      acc[key] = normalizeDateValue(values[key])
      return acc
    }, {})

    await onQuery(filterEmptyProperties({
      ...normalizedValues,
      page: nextPage,
      limit: nextLimit,
    }))

    if (autoScroll)
      window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [form, onQuery, autoScroll])

  const handleSearch = useCallback(async () => {
    setPage(1)
    await triggerQuery(1, limitRef.current)
  }, [triggerQuery])

  const handleReset = useCallback(async () => {
    form.setFieldsValue(initialValues)
    setPage(1)
    await triggerQuery(1, limitRef.current)
  }, [form, initialValues, triggerQuery])

  const handlePageChange = useCallback(async (nextPage: number, nextLimit?: number) => {
    const limitValue = nextLimit ?? limitRef.current
    setPage(nextPage)
    setLimit(limitValue)
    await triggerQuery(nextPage, limitValue)
  }, [triggerQuery])

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev)
  }, [])

  useImperativeHandle(ref, () => ({
    reload: () => { void triggerQuery() },
    reset: () => { void handleReset() },
    form,
  }), [triggerQuery, handleReset, form])

  const rowSelection = useMemo(() => {
    if (!selection) return undefined
    return {
      getCheckboxProps: (record: T) => ({
        disabled: !selectable(record),
      }),
    }
  }, [selection, selectable])

  const antdColumns = useMemo(() => toAntdColumns(columns), [columns])

  const pageSizeOptions = useMemo(() => pageSizes.map(String), [pageSizes])

  const collapseStyle = useMemo<React.CSSProperties>(() => ({
    maxHeight: isExpanded ? 'none' : 132,
    overflow: 'hidden',
    transition: 'max-height 0.25s ease',
  }), [isExpanded])

  return (
    <div>
      {filterItems.length > 0 && (
        <div className="filter-card">
          <div style={collapseStyle}>
            <Form form={form} layout="horizontal">
              <div ref={formGridRef} style={FORM_GRID_STYLE}>
                {filterItems.map(item => (
                  <Form.Item
                    key={item.prop}
                    name={item.prop}
                    label={item.label}
                    style={FORM_ITEM_STYLE}
                    labelCol={LABEL_COL_STYLE}
                    wrapperCol={WRAPPER_COL_STYLE}
                  >
                    <FilterControl item={item} onPressEnter={handleSearch} />
                  </Form.Item>
                ))}
              </div>
            </Form>
          </div>
          <div className="filter-actions">
            {shouldShowExpandButton && (
              <Button type="link" onClick={toggleExpanded}>
                {isExpanded ? '收起' : '展开'}
                <DownOutlined rotate={isExpanded ? 180 : 0} />
              </Button>
            )}
            <Button type="primary" onClick={handleSearch}>查询</Button>
            <Button onClick={handleReset}>重置</Button>
            {renderTableActions}
          </div>
        </div>
      )}

      <Table<T>
        bordered
        rowKey={(record: T, index?: number) => String((record as any).id ?? index)}
        loading={loading}
        columns={antdColumns}
        dataSource={data}
        rowSelection={rowSelection}
        pagination={false}
        {...tableProps}
      />

      {showPagination && total > 0 && (
        <div style={PAGINATION_WRAPPER_STYLE}>
          <Pagination
            current={page}
            pageSize={limit}
            pageSizeOptions={pageSizeOptions}
            total={total}
            showSizeChanger
            showQuickJumper
            showTotal={count => `Total ${count}`}
            onChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}

const FilterTable = forwardRef(InternalFilterTable) as <T extends Record<string, any>>(
  props: FilterTableProps<T> & { ref?: React.Ref<FilterTableRef> },
) => React.ReactElement

export default FilterTable
