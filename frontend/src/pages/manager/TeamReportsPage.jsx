import { useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'

function TeamReportsPage() {
  const { users, reports } = useAuth()
  const [memberFilter, setMemberFilter] = useState('all')
  const [projectFilter, setProjectFilter] = useState('all')

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesMember = memberFilter === 'all' || report.userId === Number(memberFilter)
      const matchesProject = projectFilter === 'all' || report.project === projectFilter
      return matchesMember && matchesProject
    })
  }, [memberFilter, projectFilter, reports])

  return (
    <section className="panel">
      <p className="eyebrow">Manager view</p>
      <h2>Team report review</h2>
      <div className="filter-row">
        <select value={memberFilter} onChange={(event) => setMemberFilter(event.target.value)}>
          <option value="all">All team members</option>
          {users.filter((user) => user.role === 'member').map((user) => (
            <option value={user.id} key={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <select value={projectFilter} onChange={(event) => setProjectFilter(event.target.value)}>
          <option value="all">All projects</option>
          {[...new Set(reports.map((report) => report.project))].map((project) => (
            <option key={project} value={project}>
              {project}
            </option>
          ))}
        </select>
      </div>

      <div className="history-list">
        {filteredReports.map((report) => {
          const user = users.find((item) => item.id === report.userId)
          return (
            <article key={report.id} className="history-card">
              <div className="history-header">
                <strong>{user?.name ?? 'Unknown user'}</strong>
                <span className={`pill ${report.status}`}>{report.status}</span>
              </div>
              <p>{report.week} • {report.project}</p>
              <p>{report.tasksCompleted}</p>
              <p>{report.blockers}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default TeamReportsPage
