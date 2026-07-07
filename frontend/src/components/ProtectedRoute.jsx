import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ allowedRoles }) {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
