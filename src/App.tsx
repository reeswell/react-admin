import { App as AntdApp, ConfigProvider } from 'antd'
import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { useThemeStore } from './store/themeStore'

function App() {
  const primaryColor = useThemeStore(state => state.primaryColor)
  const applyThemeVars = useThemeStore(state => state.applyThemeVars)

  useEffect(() => {
    applyThemeVars(primaryColor)
  }, [applyThemeVars, primaryColor])

  return (
    <ConfigProvider theme={{ token: { colorPrimary: primaryColor } }}>
      <AntdApp>
        <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
