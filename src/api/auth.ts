export interface UserInfo {
  id: number
  name: string
  role: 'admin' | 'user'
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function loginApi(username: string, password: string) {
  await wait(300)
  if (
    (username === 'admin' && password === 'admin123')
    || (username === 'user' && password === 'user123')
  ) {
    return { token: `${username}-token` }
  }
  throw new Error('用户名或密码错误')
}

export async function fetchUserInfoApi(token: string): Promise<UserInfo> {
  await wait(300)
  if (token.includes('admin')) {
    return { id: 1, name: 'Admin', role: 'admin' }
  }
  return { id: 2, name: 'User', role: 'user' }
}
