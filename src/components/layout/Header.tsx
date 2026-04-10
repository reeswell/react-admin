import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { Breadcrumb, Dropdown, Layout, Space, Typography } from 'antd'
import type { ItemType } from 'antd/es/breadcrumb/Breadcrumb'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { menus } from '../../config/menus'
import { useLayoutStore } from '../../store/layoutStore'
import { useUserStore } from '../../store/userStore'
import ThemeSwitcher from '../settings/ThemeSwitcher'

const { Header: AntHeader } = Layout

function buildBreadcrumb(pathname: string): ItemType[] {
  for (const menu of menus) {
    if (menu.path === pathname) {
      return [{ title: menu.label }]
    }
    if (menu.children) {
      const child = menu.children.find(item => item.path === pathname)
      if (child) {
        return [{ title: menu.label }, { title: child.label }]
      }
    }
  }
  return [{ title: '页面' }]
}

export default function Header() {
  const [themeOpen, setThemeOpen] = useState(false)
  const collapsed = useLayoutStore(state => state.collapsed)
  const toggleCollapsed = useLayoutStore(state => state.toggleCollapsed)
  const userInfo = useUserStore(state => state.userInfo)
  const logout = useUserStore(state => state.logout)
  const navigate = useNavigate()
  const location = useLocation()

  const breadcrumbItems = useMemo(() => buildBreadcrumb(location.pathname), [location.pathname])

  return (
    <AntHeader className="app-header">
      <Space size="middle">
        {collapsed
          ? <MenuUnfoldOutlined className="header-action" onClick={toggleCollapsed} />
          : <MenuFoldOutlined className="header-action" onClick={toggleCollapsed} />}
        <Breadcrumb items={breadcrumbItems} />
      </Space>
      <Space className="header-tools">
        <SettingOutlined className="header-action" onClick={() => setThemeOpen(true)} />
        <Dropdown
          menu={{
            items: [{ key: 'logout', icon: <LogoutOutlined />, label: '退出登录' }],
            onClick: () => {
              logout()
              navigate('/login')
            },
          }}
        >
          <Space className="header-action">
            <UserOutlined />
            <Typography.Text>{userInfo?.name || 'User'}</Typography.Text>
          </Space>
        </Dropdown>
      </Space>
      <ThemeSwitcher open={themeOpen} onClose={() => setThemeOpen(false)} />
    </AntHeader>
  )
}
