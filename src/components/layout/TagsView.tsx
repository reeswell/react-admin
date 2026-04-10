import { Tabs } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { menus } from '../../config/menus'
import { useTagsStore } from '../../store/tagsStore'

function getTitle(pathname: string) {
  for (const menu of menus) {
    if (menu.path === pathname)
      return menu.label
    if (menu.children) {
      const child = menu.children.find(item => item.path === pathname)
      if (child)
        return child.label
    }
  }
  return pathname
}

export default function TagsView() {
  const location = useLocation()
  const navigate = useNavigate()
  const visitedViews = useTagsStore(state => state.visitedViews)
  const addView = useTagsStore(state => state.addView)
  const removeView = useTagsStore(state => state.removeView)
  const removeOthers = useTagsStore(state => state.removeOthers)
  const removeAll = useTagsStore(state => state.removeAll)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ left: 0, top: 0 })
  const [selectedPath, setSelectedPath] = useState('')

  const currentPath = location.pathname
  useEffect(() => {
    addView({ path: currentPath, title: getTitle(currentPath) })
  }, [addView, currentPath])

  useEffect(() => {
    if (!menuOpen)
      return
    const closeMenu = () => setMenuOpen(false)
    document.addEventListener('click', closeMenu)
    return () => document.removeEventListener('click', closeMenu)
  }, [menuOpen])

  const tabItems = useMemo(() => {
    return visitedViews.map(v => ({
      key: v.path,
      label: (
        <span
          className="tags-view-tab-label"
          onContextMenu={(event) => {
            event.preventDefault()
            setSelectedPath(v.path)
            setMenuPosition({ left: event.clientX, top: event.clientY })
            setMenuOpen(true)
          }}
        >
          {v.title}
        </span>
      ),
      closable: v.path !== '/',
    }))
  }, [visitedViews])

  const closeTag = (path: string) => {
    removeView(path)
    if (path === currentPath) {
      const next = visitedViews.find(v => v.path !== path)?.path || '/'
      navigate(next)
    }
  }

  const refreshTag = (path: string) => {
    if (path === currentPath) {
      navigate(0)
      return
    }
    navigate(path)
  }

  return (
    <div className="tags-view">
      <Tabs
        hideAdd
        type="editable-card"
        activeKey={currentPath}
        items={tabItems}
        onChange={key => navigate(key)}
        onEdit={(targetKey, action) => {
          if (action === 'remove') {
            const key = String(targetKey)
            closeTag(key)
          }
        }}
      />
      {menuOpen && (
        <ul className="tags-view-context-menu" style={{ left: menuPosition.left, top: menuPosition.top, position: 'fixed', zIndex: 1000 }}>
          <li
            onClick={() => {
              refreshTag(selectedPath)
              setMenuOpen(false)
            }}
          >
            刷新
          </li>
          {selectedPath !== '/' && (
            <li
              onClick={() => {
                closeTag(selectedPath)
                setMenuOpen(false)
              }}
            >
              关闭
            </li>
          )}
          <li
            onClick={() => {
              removeOthers(selectedPath)
              navigate(selectedPath || '/')
              setMenuOpen(false)
            }}
          >
            关闭其他窗口
          </li>
          <li
            onClick={() => {
              removeAll()
              navigate('/')
              setMenuOpen(false)
            }}
          >
            关闭所有窗口
          </li>
        </ul>
      )}
    </div>
  )
}
