import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Layout() {
  const { currentUser, logout } = useAuth()

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Weekly Report Generator</p>
          <h1>Team reporting workspace</h1>
        </div>
        <nav className="nav-links">
          {!currentUser ? (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/">Overview</NavLink>
              {currentUser.role === 'member' ? (
                <NavLink to="/member/reports">My Reports</NavLink>
              ) : (
                <>
                  <NavLink to="/manager/dashboard">Dashboard</NavLink>
                  <NavLink to="/manager/reports">Team Reports</NavLink>
                  <NavLink to="/manager/projects">Projects</NavLink>
                </>
              )}
              <button type="button" className="ghost-button" onClick={logout}>
                Logout
              </button>
            </>
          )}
        </nav>
      </header>

      <main className="page-shell">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
