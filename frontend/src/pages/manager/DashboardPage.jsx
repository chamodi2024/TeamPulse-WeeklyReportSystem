import { useMemo } from 'react'
import { BarChart, Bar, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAuth } from '../../context/AuthContext'

function DashboardPage() {
  const { users, reports, projects } = useAuth()

  const summary = useMemo(() => {
    const submitted = reports.filter((report) => report.status === 'submitted').length
    const pending = reports.filter((report) => report.status === 'pending').length
    const blockers = reports.filter((report) => report.blockers && report.blockers !== 'None').length

    const trendData = reports.reduce((acc, report) => {
      const existing = acc.find((item) => item.week === report.week)
      if (existing) {
        existing.submitted += 1
      } else {
        acc.push({ week: report.week, submitted: 1 })
      }
      return acc
    }, [])

    const distribution = projects.map((project) => ({
      name: project.name,
      reports: reports.filter((report) => report.project === project.name).length,
    }))

    return { submitted, pending, blockers, trendData, distribution }
  }, [reports, projects])

  return (
    <div className="card-grid">
      <section className="panel">
        <p className="eyebrow">Manager dashboard</p>
        <h2>Team insights</h2>
        <div className="metric-grid">
          <article className="metric-card">
            <h3>Total submitted</h3>
            <p>{summary.submitted}</p>
          </article>
          <article className="metric-card">
            <h3>Pending reports</h3>
            <p>{summary.pending}</p>
          </article>
          <article className="metric-card">
            <h3>Open blockers</h3>
            <p>{summary.blockers}</p>
          </article>
        </div>
      </section>

      <section className="panel">
        <h3>Submission trend</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={summary.trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="submitted" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="panel">
        <h3>Workload by project</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={summary.distribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="reports" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="panel">
        <h3>Team members</h3>
        <ul className="bullet-list">
          {users.filter((user) => user.role === 'member').map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default DashboardPage
