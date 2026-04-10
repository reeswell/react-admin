import { Layout } from 'antd'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useLayoutStore } from '../../store/layoutStore'
import { useUserStore } from '../../store/userStore'
import Header from './Header'
import Sidebar from './Sidebar'
import TagsView from './TagsView'

const { Content } = Layout

export default function MainLayout() {
  const showTagsView = useLayoutStore(state => state.showTagsView)
  const fixedHeader = useLayoutStore(state => state.fixedHeader)
  const fetchUserInfo = useUserStore(state => state.fetchUserInfo)

  useEffect(() => {
    void fetchUserInfo()
  }, [fetchUserInfo])

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <Layout style={{ overflow: 'auto' }}>
        <div style={fixedHeader ? { position: 'sticky', top: 0, zIndex: 100 } : undefined}>
          <Header />
        </div>
        {showTagsView && <TagsView />}
        <Content className="app-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
