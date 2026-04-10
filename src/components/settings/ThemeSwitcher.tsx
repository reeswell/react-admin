import { Button, ColorPicker, Divider, Drawer, Form, Space, Switch, message } from 'antd'
import type { Color } from 'antd/es/color-picker'
import { useEffect, useState } from 'react'
import { useLayoutStore } from '../../store/layoutStore'
import { useThemeStore } from '../../store/themeStore'
import ColorRadioGroup from './ColorRadioGroup'

interface ThemeSwitcherProps {
  open: boolean
  onClose: () => void
}

export default function ThemeSwitcher({ open, onClose }: ThemeSwitcherProps) {
  const [messageApi, contextHolder] = message.useMessage()
  const primaryColor = useThemeStore(state => state.primaryColor)
  const setPrimaryColor = useThemeStore(state => state.setPrimaryColor)
  const resetTheme = useThemeStore(state => state.resetTheme)
  const showTagsView = useLayoutStore(state => state.showTagsView)
  const fixedHeader = useLayoutStore(state => state.fixedHeader)
  const setShowTagsView = useLayoutStore(state => state.setShowTagsView)
  const setFixedHeader = useLayoutStore(state => state.setFixedHeader)
  const resetLayoutConfig = useLayoutStore(state => state.resetLayoutConfig)

  const [draftPrimary, setDraftPrimary] = useState(primaryColor)
  const [draftShowTags, setDraftShowTags] = useState(showTagsView)
  const [draftFixedHeader, setDraftFixedHeader] = useState(fixedHeader)

  const syncFromStore = () => {
    setDraftPrimary(primaryColor)
    setDraftShowTags(showTagsView)
    setDraftFixedHeader(fixedHeader)
  }

  useEffect(() => {
    if (open) {
      syncFromStore()
    }
  }, [open, primaryColor, showTagsView, fixedHeader])

  const applyConfig = () => {
    setPrimaryColor(draftPrimary)
    setShowTagsView(draftShowTags)
    setFixedHeader(draftFixedHeader)
    messageApi.success('配置已应用')
  }

  const resetConfig = () => {
    resetTheme()
    resetLayoutConfig()
    setDraftPrimary('#1677ff')
    setDraftShowTags(true)
    setDraftFixedHeader(true)
    messageApi.success('配置已重置')
  }

  const onPrimaryChange = (value: string | Color) => {
    const nextColor = typeof value === 'string' ? value : value.toHexString()
    setDraftPrimary(nextColor)
  }

  return (
    <>
      {contextHolder}
      <Drawer
        title="主题配置"
        placement="right"
        width={420}
        open={open}
        onClose={() => {
          syncFromStore()
          onClose()
        }}
      >
        <Form layout="horizontal" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
          <Divider style={{ marginTop: 0 }} />
          <Form.Item label="主色">
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <ColorPicker value={draftPrimary} onChange={onPrimaryChange} />
              <ColorRadioGroup value={draftPrimary} onChange={setDraftPrimary} />
            </Space>
          </Form.Item>
          <Form.Item label="快捷导航">
            <Switch checked={draftShowTags} onChange={setDraftShowTags} />
          </Form.Item>
          <Form.Item label="固定头部">
            <Switch checked={draftFixedHeader} onChange={setDraftFixedHeader} />
          </Form.Item>
          <Space>
            <Button type="primary" onClick={applyConfig}>
              应用配置
            </Button>
            <Button onClick={resetConfig}>重置配置</Button>
          </Space>
        </Form>
      </Drawer>
    </>
  )
}
