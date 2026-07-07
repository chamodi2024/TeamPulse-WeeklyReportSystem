import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import WeeklyReportPage from './pages/member/WeeklyReportPage'
import DashboardPage from './pages/manager/DashboardPage'
import ProjectsPage from './pages/manager/ProjectsPage'
import TeamReportsPage from './pages/manager/TeamReportsPage'
import NotFoundPage from './pages/NotFoundPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<div className="panel">You are not authorized to view this page.</div>} />

            <Route element={<ProtectedRoute allowedRoles={['member']} />}>
              <Route path="/member/reports" element={<WeeklyReportPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
              <Route path="/manager/dashboard" element={<DashboardPage />} />
              <Route path="/manager/reports" element={<TeamReportsPage />} />
              <Route path="/manager/projects" element={<ProjectsPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
