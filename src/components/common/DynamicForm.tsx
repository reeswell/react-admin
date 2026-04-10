import { Button, Card, Cascader, Checkbox, DatePicker, Form, Input, InputNumber, Radio, Select, Space, Switch } from 'antd'

export interface DynamicField {
  name: string
  label: string
  type: 'input' | 'select' | 'date' | 'checkbox' | 'radio' | 'switch' | 'number' | 'cascader'
  required?: boolean
  options?: Array<{ label: string, value: string | number, children?: Array<{ label: string, value: string | number }> }>
}

export default function DynamicForm({
  fields,
  onSubmit,
}: {
  fields: DynamicField[]
  onSubmit: (values: Record<string, unknown>) => void
}) {
  const [form] = Form.useForm()
  return (
    <Card>
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        {fields.map((field) => {
          let control: React.ReactNode = <Input />
          if (field.type === 'select')
            control = <Select options={field.options} />
          if (field.type === 'date')
            control = <DatePicker style={{ width: '100%' }} />
          if (field.type === 'checkbox')
            control = <Checkbox />
          if (field.type === 'radio')
            control = <Radio.Group options={field.options} />
          if (field.type === 'switch')
            control = <Switch />
          if (field.type === 'number')
            control = <InputNumber style={{ width: '100%' }} />
          if (field.type === 'cascader')
            control = <Cascader options={field.options} />

          return (
            <Form.Item
              key={field.name}
              name={field.name}
              label={field.label}
              valuePropName={field.type === 'switch' ? 'checked' : undefined}
              rules={field.required ? [{ required: true, message: `请输入${field.label}` }] : undefined}
            >
              {control}
            </Form.Item>
          )
        })}
        <Space>
          <Button type="primary" htmlType="submit">提交</Button>
          <Button onClick={() => form.resetFields()}>重置</Button>
        </Space>
      </Form>
    </Card>
  )
}
