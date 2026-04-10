import { create } from 'zustand'
import { fetchUserInfoApi, loginApi, type UserInfo } from '../api/auth'
import { TOKEN_KEY } from '../config/const'

interface UserState {
  token: string
  userInfo: UserInfo | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  fetchUserInfo: () => Promise<void>
  logout: () => void
}

const initialToken = localStorage.getItem(TOKEN_KEY) || ''

export const useUserStore = create<UserState>((set, get) => ({
  token: initialToken,
  userInfo: null,
  loading: false,
  login: async (username, password) => {
    set({ loading: true })
    try {
      const res = await loginApi(username, password)
      localStorage.setItem(TOKEN_KEY, res.token)
      set({ token: res.token })
      await get().fetchUserInfo()
    }
    finally {
      set({ loading: false })
    }
  },
  fetchUserInfo: async () => {
    const token = get().token
    if (!token)
      return
    const info = await fetchUserInfoApi(token)
    set({ userInfo: info })
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    set({ token: '', userInfo: null })
  },
}))
