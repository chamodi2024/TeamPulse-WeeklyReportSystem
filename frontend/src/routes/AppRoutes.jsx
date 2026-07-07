import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from '../components/Layout'
import ProtectedRoute from '../components/ProtectedRoute'
import { useAuth } from '../context/AuthContext'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import NotFoundPage from '../pages/NotFoundPage'
import WeeklyReportPage from '../pages/member/WeeklyReportPage'
import DashboardPage from '../pages/manager/DashboardPage'
import ProjectsPage from '../pages/manager/ProjectsPage'
import TeamReportsPage from '../pages/manager/TeamReportsPage'

function HomePage() {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  return (
    <section className="card-grid">
      <article className="panel hero-panel">
        <p className="eyebrow">Welcome back</p>
        <h2>{currentUser.name}</h2>
        <p>
          This workspace is structured for weekly reporting, role-based access, and manager analytics.
        </p>
      </article>
      <article className="panel">
        <h3>Suggested flow</h3>
        <ul className="bullet-list">
          <li>Team members submit structured weekly reports.</li>
          <li>Managers review the dashboard and team report feed.</li>
          <li>Projects can be managed from the manager area.</li>
        </ul>
      </article>
    </section>
  )
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute allowedRoles={['member']} />}>
            <Route path="member/reports" element={<WeeklyReportPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
            <Route path="manager/dashboard" element={<DashboardPage />} />
            <Route path="manager/reports" element={<TeamReportsPage />} />
            <Route path="manager/projects" element={<ProjectsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
