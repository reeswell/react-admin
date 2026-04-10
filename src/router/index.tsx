import { Navigate, createBrowserRouter, useLocation } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import FormPage from '../pages/eg/form'
import UserPage from '../pages/eg/user'
import Error403Page from '../pages/error/403'
import HomePage from '../pages/home'
import LoginPage from '../pages/login'
import SalesOrderPage from '../pages/sales/order'
import { useUserStore } from '../store/userStore'

function AuthGuard({ children }: { children: JSX.Element }) {
  const token = useUserStore(state => state.token)
  const location = useLocation()

  if (!token) {
    const redirect = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?redirect=${redirect}`} replace />
  }
  return children
}

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/403', element: <Error403Page /> },
  {
    path: '/',
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'sales/order', element: <SalesOrderPage /> },
      { path: 'eg/user', element: <UserPage /> },
      { path: 'eg/form', element: <FormPage /> },
    ],
  },
])
