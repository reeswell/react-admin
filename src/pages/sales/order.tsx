import { App, Button, Space, Tag } from 'antd'
import { useMemo, useState } from 'react'
import FilterTable, { type FilterFormItem, type FilterTableColumn } from '../../components/common/FilterTable'

interface OrderRow {
  id: number
  orderNo: string
  customer: string
  amount: number
  status: 'pending' | 'approved' | 'cancelled'
  date: string
}

const statuses = [
  { label: '待审核', value: 'pending' },
  { label: '已通过', value: 'approved' },
  { label: '已取消', value: 'cancelled' },
]

const allOrders: OrderRow[] = Array.from({ length: 156 }).map((_, idx) => ({
  id: idx + 1,
  orderNo: `SO-${String(idx + 1).padStart(5, '0')}`,
  customer: `客户${(idx % 18) + 1}`,
  amount: Number((Math.random() * 10000 + 200).toFixed(2)),
  status: idx % 4 === 0 ? 'pending' : idx % 3 === 0 ? 'cancelled' : 'approved',
  date: `2026-04-${String((idx % 28) + 1).padStart(2, '0')}`,
}))

export default function SalesOrderPage() {
  const { message } = App.useApp()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<OrderRow[]>([])
  const [total, setTotal] = useState(0)

  const filterItems = useMemo<FilterFormItem[]>(() => ([
    { prop: 'orderNo', label: '订单号', type: 'input', placeholder: '请输入订单号' },
    { prop: 'customer', label: '客户名', type: 'input', placeholder: '请输入客户名' },
    { prop: 'status', label: '状态', type: 'select', options: statuses },
    { prop: 'dateRange', label: '日期', type: 'daterange' },
  ]), [])

  const columns = useMemo<Array<FilterTableColumn<OrderRow>>>(() => ([
    { prop: 'orderNo', label: '订单号', width: 180 },
    { prop: 'customer', label: '客户' },
    { prop: 'amount', label: '金额', formatter: row => `¥ ${row.amount}` },
    {
      prop: 'status',
      label: '状态',
      render: row => (
        <Tag color={row.status === 'approved' ? 'success' : row.status === 'cancelled' ? 'error' : 'processing'}>
          {statuses.find(s => s.value === row.status)?.label}
        </Tag>
      ),
    },
    { prop: 'date', label: '日期' },
    {
      prop: 'actions',
      label: '操作',
      width: 260,
      render: row => (
        <Space>
          <Button size="small" onClick={() => message.info(`查看 ${row.orderNo}`)}>查看</Button>
          <Button size="small" onClick={() => message.info(`编辑 ${row.orderNo}`)}>编辑</Button>
          <Button size="small" type="primary" ghost onClick={() => message.success(`通过 ${row.orderNo}`)}>通过</Button>
          <Button size="small" danger onClick={() => message.warning(`取消 ${row.orderNo}`)}>取消</Button>
        </Space>
      ),
    },
  ]), [message])

  return (
    <FilterTable<OrderRow>
      columns={columns}
      filterItems={filterItems}
      data={data}
      total={total}
      loading={loading}

      renderTableActions={(
        <Space>
          <Button>导出</Button>
          <Button type="primary">新增</Button>
        </Space>
      )}
      onQuery={async (params) => {
        setLoading(true)
        await new Promise(resolve => setTimeout(resolve, 300))
        let list = [...allOrders]
        if (params.orderNo)
          list = list.filter(item => item.orderNo.includes(String(params.orderNo)))
        if (params.customer)
          list = list.filter(item => item.customer.includes(String(params.customer)))
        if (params.status)
          list = list.filter(item => item.status === params.status)
        const page = Number(params.page || 1)
        const limit = Number(params.limit || 20)
        setTotal(list.length)
        setData(list.slice((page - 1) * limit, page * limit))
        setLoading(false)
      }}
    />
  )
}
