import { App, Typography } from 'antd'
import DynamicForm, { type DynamicField } from '../../components/common/DynamicForm'

const fields: DynamicField[] = [
  { name: 'name', label: '姓名', type: 'input', required: true },
  {
    name: 'gender',
    label: '性别',
    type: 'select',
    options: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }],
  },
  { name: 'birthday', label: '生日', type: 'date' },
  { name: 'active', label: '启用', type: 'switch' },
  { name: 'amount', label: '数量', type: 'number' },
  {
    name: 'hobby',
    label: '爱好',
    type: 'checkbox',
  },
  {
    name: 'type',
    label: '类型',
    type: 'radio',
    options: [{ label: 'A', value: 'A' }, { label: 'B', value: 'B' }],
  },
]

export default function FormPage() {
  const { message } = App.useApp()
  return (
    <div>
      <Typography.Title level={4}>动态表单</Typography.Title>
      <DynamicForm
        fields={fields}
        onSubmit={(values) => {
          message.success(`提交成功: ${JSON.stringify(values)}`)
        }}
      />
    </div>
  )
}
