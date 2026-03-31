import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

function ProtectedRoute({ children, roles, layout: Layout }) {
  const { user } = useAuthStore()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/login" replace />
  }

  if (Layout) {
    return <Layout>{children}</Layout>
  }

  return children
}

export default ProtectedRoute
