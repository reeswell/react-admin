import { create } from 'zustand'
import { genPrimaryVars } from '../utils/color'

const THEME_KEY = 'theme'
const DEFAULT_PRIMARY = '#1677ff'

interface ThemeStoreState {
  primaryColor: string
  setPrimaryColor: (color: string) => void
  resetTheme: () => void
  applyThemeVars: (color: string) => void
}

function readPrimaryColor(): string {
  try {
    const savedTheme = localStorage.getItem(THEME_KEY)
    if (!savedTheme) {
      return DEFAULT_PRIMARY
    }
    const parsed = JSON.parse(savedTheme) as { colors?: { primary?: string } }
    return parsed.colors?.primary || DEFAULT_PRIMARY
  }
  catch {
    return DEFAULT_PRIMARY
  }
}

function savePrimaryColor(color: string) {
  try {
    localStorage.setItem(THEME_KEY, JSON.stringify({ colors: { primary: color } }))
  }
  catch {
    // Ignore quota and JSON errors to keep runtime stable.
  }
}

function applyThemeVars(color: string) {
  const vars = genPrimaryVars(color)
  Object.entries(vars).forEach(([name, value]) => {
    document.documentElement.style.setProperty(name, value)
  })
}

export const useThemeStore = create<ThemeStoreState>((set) => {
  const initialPrimary = readPrimaryColor()
  applyThemeVars(initialPrimary)

  return {
    primaryColor: initialPrimary,
    setPrimaryColor: (color) => {
      applyThemeVars(color)
      savePrimaryColor(color)
      set({ primaryColor: color })
    },
    resetTheme: () => {
      applyThemeVars(DEFAULT_PRIMARY)
      savePrimaryColor(DEFAULT_PRIMARY)
      set({ primaryColor: DEFAULT_PRIMARY })
    },
    applyThemeVars,
  }
})
