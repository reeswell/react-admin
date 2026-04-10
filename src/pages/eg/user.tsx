import { App, Button, Form, Input, Modal, Popconfirm, Space } from 'antd'
import { useMemo, useState } from 'react'
import FilterTable, { type FilterFormItem, type FilterTableColumn } from '../../components/common/FilterTable'

interface UserRow {
  id: number
  name: string
  account: string
  phone: string
}

const mockUsers: UserRow[] = Array.from({ length: 98 }).map((_, idx) => ({
  id: idx + 1,
  name: `用户${idx + 1}`,
  account: `user${idx + 1}`,
  phone: `1380000${String(idx + 1).padStart(4, '0')}`,
}))

export default function UserPage() {
  const { message } = App.useApp()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<UserRow[]>([])
  const [total, setTotal] = useState(0)
  const [editing, setEditing] = useState<UserRow | null>(null)
  const [form] = Form.useForm<UserRow>()

  const filterItems = useMemo<FilterFormItem[]>(() => ([
    { prop: 'name', label: '姓名', type: 'input' },
    { prop: 'account', label: '账号', type: 'input' },
  ]), [])

  const columns = useMemo<Array<FilterTableColumn<UserRow>>>(() => ([
    { prop: 'id', label: 'ID', width: 80 },
    { prop: 'name', label: '姓名' },
    { prop: 'account', label: '账号' },
    { prop: 'phone', label: '电话' },
    {
      prop: 'actions',
      label: '操作',
      width: 180,
      render: row => (
        <Space>
          <Button
            size="small"
            onClick={() => {
              setEditing(row)
              form.setFieldsValue(row)
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除该用户?"
            onConfirm={() => message.success(`已删除 ${row.name}`)}
          >
            <Button size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]), [form, message])

  return (
    <>
      <FilterTable<UserRow>
        columns={columns}
        filterItems={filterItems}
        data={data}
        total={total}
        loading={loading}
        onQuery={async (params) => {
          setLoading(true)
          await new Promise(resolve => setTimeout(resolve, 300))
          let list = [...mockUsers]
          if (params.name)
            list = list.filter(item => item.name.includes(String(params.name)))
          if (params.account)
            list = list.filter(item => item.account.includes(String(params.account)))
          const page = Number(params.page || 1)
          const limit = Number(params.limit || 20)
          setTotal(list.length)
          setData(list.slice((page - 1) * limit, page * limit))
          setLoading(false)
        }}
      />

      <Modal
        title="编辑用户"
        open={Boolean(editing)}
        onCancel={() => setEditing(null)}
        onOk={() => {
          form.validateFields().then(() => {
            message.success('保存成功')
            setEditing(null)
          })
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="account" label="账号" rules={[{ required: true, message: '请输入账号' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="电话">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
