import { create } from 'zustand'

const SYSTEM_CONFIG_KEY = 'system-config'

interface LayoutState {
  collapsed: boolean
  showTagsView: boolean
  fixedHeader: boolean
  toggleCollapsed: () => void
  setShowTagsView: (show: boolean) => void
  setFixedHeader: (fixed: boolean) => void
  resetLayoutConfig: () => void
}

const defaultSystemConfig = {
  showTagsView: true,
  fixedHeader: true,
}

function readSystemConfig() {
  try {
    const saved = localStorage.getItem(SYSTEM_CONFIG_KEY)
    if (!saved) {
      return defaultSystemConfig
    }
    return { ...defaultSystemConfig, ...JSON.parse(saved) } as typeof defaultSystemConfig
  }
  catch {
    return defaultSystemConfig
  }
}

function saveSystemConfig(config: { showTagsView: boolean, fixedHeader: boolean }) {
  try {
    localStorage.setItem(SYSTEM_CONFIG_KEY, JSON.stringify(config))
  }
  catch {
    // Ignore storage errors.
  }
}

export const useLayoutStore = create<LayoutState>((set, get) => {
  const initialConfig = readSystemConfig()
  return {
    collapsed: false,
    showTagsView: initialConfig.showTagsView,
    fixedHeader: initialConfig.fixedHeader,
    toggleCollapsed: () => set(state => ({ collapsed: !state.collapsed })),
    setShowTagsView: (show) => {
      set({ showTagsView: show })
      const { fixedHeader } = get()
      saveSystemConfig({ showTagsView: show, fixedHeader })
    },
    setFixedHeader: (fixed) => {
      set({ fixedHeader: fixed })
      const { showTagsView } = get()
      saveSystemConfig({ showTagsView, fixedHeader: fixed })
    },
    resetLayoutConfig: () => {
      set({
        showTagsView: defaultSystemConfig.showTagsView,
        fixedHeader: defaultSystemConfig.fixedHeader,
      })
      saveSystemConfig(defaultSystemConfig)
    },
  }
})
