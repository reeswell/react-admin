import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { App, Button, Card, Checkbox, Form, Input } from 'antd'
import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUserStore } from '../../store/userStore'

export default function LoginPage() {
  const [form] = Form.useForm()
  const login = useUserStore(state => state.login)
  const loading = useUserStore(state => state.loading)
  const navigate = useNavigate()
  const location = useLocation()
  const { message } = App.useApp()

  const redirect = useMemo(() => {
    const search = new URLSearchParams(location.search)
    return decodeURIComponent(search.get('redirect') || '/')
  }, [location.search])

  return (
    <div className="login-page">
      <div className="login-left">
        <img
          src="https://dummyimage.com/800x667/667fff/fff/ffffff.png?text=react-admin"
          alt="react-admin"
        />
      </div>
      <div className="login-right">
        <Card title="账号登录" style={{ width: 380 }}>
          <Form
            form={form}
            layout="vertical"
            initialValues={{ username: 'admin', password: 'admin123', remember: true }}
            onFinish={async (values) => {
              try {
                await login(values.username, values.password)
                navigate(redirect || '/')
              }
              catch (error) {
                message.error((error as Error).message)
              }
            }}
          >
            <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
              <Input prefix={<UserOutlined />} placeholder="admin / user" />
            </Form.Item>
            <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="admin123 / user123" />
            </Form.Item>
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>记住我</Checkbox>
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  )
}
