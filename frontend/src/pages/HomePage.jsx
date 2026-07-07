import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

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
        <p>This workspace is structured for weekly reporting, role-based access, and manager analytics.</p>
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

export default HomePage
