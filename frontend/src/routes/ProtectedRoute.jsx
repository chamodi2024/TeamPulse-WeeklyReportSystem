import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ allowedRoles }) {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return <div className="panel">Loading...</div>
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
