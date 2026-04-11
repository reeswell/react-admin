import {
  ApartmentOutlined,
  FormOutlined,
  HomeFilled,
  ShoppingCartOutlined,
  TableOutlined,
  UserOutlined,
} from '@ant-design/icons'
import type { ReactNode } from 'react'

export interface MenuItem {
  key: string
  label: string
  path?: string
  icon?: ReactNode
  children?: MenuItem[]
}

export const menus: MenuItem[] = [
  {
    key: 'home',
    label: '首页',
    path: '/',
    icon: <HomeFilled />,
  },
  {
    key: 'sales',
    label: '销售',
    icon: <ShoppingCartOutlined />,
    children: [
      { key: 'sales-order', label: '销售单', path: '/sales/order', icon: <TableOutlined /> },
    ],
  },
  {
    key: 'user',
    label: '用户',
    icon: <UserOutlined />,
    children: [
      { key: 'eg-form', label: '表单', path: '/eg/form', icon: <FormOutlined /> },
      { key: 'eg-user', label: '表格', path: '/eg/user', icon: <TableOutlined /> },
      { key: 'eg-department', label: '树形表格', path: '/eg/department', icon: <ApartmentOutlined /> },
    ],
  },
]
