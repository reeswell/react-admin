import { Layout, Menu } from 'antd'
import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SYSTEM_NAME } from '../../config/const'
import { menus, type MenuItem } from '../../config/menus'
import { useLayoutStore } from '../../store/layoutStore'

const { Sider } = Layout

function toAntdItems(items: MenuItem[]): any[] {
  return items.map(item => ({
    key: item.path || item.key,
    icon: item.icon,
    label: item.label,
    children: item.children ? toAntdItems(item.children) : undefined,
  }))
}

function findOpenKeys(pathname: string) {
  const openKeys: string[] = []
  menus.forEach((menu) => {
    if (menu.children?.some(child => child.path === pathname)) {
      openKeys.push(menu.key)
    }
  })
  return openKeys
}

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const collapsed = useLayoutStore(state => state.collapsed)

  const items = useMemo(() => toAntdItems(menus), [])

  return (
    <Sider width={220} collapsible collapsed={collapsed} trigger={null} theme="light" className="app-sider">
      <div className="app-sider-inner">
        <div className="app-logo">{collapsed ? 'xx' : SYSTEM_NAME}</div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={findOpenKeys(location.pathname)}
          items={items}
          className="app-sidebar-menu"
          onClick={({ key }) => {
            if (String(key).startsWith('/')) {
              navigate(String(key))
            }
          }}
        />
      </div>
    </Sider>
  )
}
