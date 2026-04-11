import { Tag } from 'antd'
import { useEffect, useMemo, useState } from 'react'

import {
  fetchDeptTypes,
  fetchStatusOptions,
  queryDepts,
  type DeptQueryParams,
  type DeptRow,
  type LabelValue,
} from '../../api/dept'
import FilterTable, {
  type FilterFormItem,
  type FilterTableColumn,
} from '../../components/common/FilterTable'

// ---------------------------------------------------------------------------
// Module-level constants — hoisted to avoid object recreation on every render
// ---------------------------------------------------------------------------

const TYPE_COLOR_MAP: Record<number, string> = {
  1: 'blue',
  2: 'cyan',
  3: 'orange',
  4: 'purple',
  5: 'red',
  6: 'default',
}

const STATUS_STYLE_MAP: Record<number, { text: string; color: string }> = {
  1: { text: '启用', color: 'success' },
  0: { text: '停用', color: 'error' },
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function DepartmentPage() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<DeptRow[]>([])
  const [typeOptions, setTypeOptions] = useState<LabelValue[]>([])
  const [statusOptions, setStatusOptions] = useState<LabelValue[]>([])
  const [optionsLoading, setOptionsLoading] = useState(true)

  // Fetch filter option lists in parallel (async-parallel)
  useEffect(() => {
    Promise.all([fetchDeptTypes(), fetchStatusOptions()])
      .then(([types, statuses]) => {
        setTypeOptions(types)
        setStatusOptions(statuses)
      })
      .finally(() => setOptionsLoading(false))
  }, [])

  // O(1) label lookup for the type column (js-index-maps)
  const typeOptionMap = useMemo(
    () => new Map(typeOptions.map(o => [o.value, o.label])),
    [typeOptions],
  )

  const filterItems = useMemo<FilterFormItem[]>(() => [
    {
      prop: 'name',
      label: '部门名称',
      type: 'input',
      placeholder: '请输入部门名称',
    },
    {
      prop: 'types',
      label: '部门类型',
      type: 'select',
      placeholder: '支持多选',
      options: typeOptions,
      // 多选初始值为空数组，避免初始化为空字符串
      defaultValue: [],
      attrs: {
        mode: 'multiple',
        loading: optionsLoading,
        maxTagCount: 'responsive',
      },
    },
    {
      prop: 'status',
      label: '状态',
      type: 'select',
      placeholder: '请选择状态',
      options: statusOptions,
      attrs: { loading: optionsLoading },
    },
  ], [typeOptions, statusOptions, optionsLoading])

  const columns = useMemo<Array<FilterTableColumn<DeptRow>>>(() => [
    {
      prop: 'name',
      label: '部门名称',
      width: 260,
      // 树形展开图标由 Ant Design Table 自动注入到第一列
      align: 'left',
    },
    {
      prop: 'type',
      label: '部门类型',
      width: 140,
      render: row => (
        <Tag color={TYPE_COLOR_MAP[row.type] ?? 'default'}>
          {typeOptionMap.get(row.type) ?? '-'}
        </Tag>
      ),
    },
    {
      prop: 'status',
      label: '状态',
      width: 100,
      render: (row) => {
        const s = STATUS_STYLE_MAP[row.status]
        return s ? <Tag color={s.color}>{s.text}</Tag> : '-'
      },
    },
    {
      prop: 'headCount',
      label: '人数',
      width: 100,
    },
  ], [typeOptionMap])

  return (
    <FilterTable<DeptRow>
      columns={columns}
      filterItems={filterItems}
      data={data}
      total={0}
      loading={loading}
      showPagination={false}
      onQuery={async (params) => {
        setLoading(true)
        try {
          const result = await queryDepts(params as DeptQueryParams)
          setData(result.list)
        }
        finally {
          setLoading(false)
        }
      }}
      tableProps={{
        // 树形数据：data 中含 children 字段时，Table 自动渲染展开图标
        expandable: { defaultExpandAllRows: true },
      }}
    />
  )
}
