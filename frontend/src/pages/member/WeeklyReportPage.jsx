import { useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const emptyForm = {
  week: '2026-W28',
  project: 'Client A',
  tasksCompleted: '',
  tasksPlanned: '',
  blockers: '',
  hoursWorked: '',
  notes: '',
  status: 'pending',
}

function WeeklyReportPage() {
  const { currentUser, reports, addReport, updateReport } = useAuth()
  const [form, setForm] = useState(emptyForm)
  const [selectedId, setSelectedId] = useState(null)

  const memberReports = useMemo(
    () => reports.filter((report) => report.userId === currentUser?.id),
    [reports, currentUser],
  )

  const handleSubmit = (event) => {
    event.preventDefault()

    if (selectedId) {
      updateReport(selectedId, { ...form, status: 'submitted' })
    } else {
      addReport({ userId: currentUser.id, ...form, status: 'submitted' })
    }

    setForm(emptyForm)
    setSelectedId(null)
  }

  const handleEdit = (report) => {
    setSelectedId(report.id)
    setForm({
      week: report.week,
      project: report.project,
      tasksCompleted: report.tasksCompleted,
      tasksPlanned: report.tasksPlanned,
      blockers: report.blockers,
      hoursWorked: report.hoursWorked,
      notes: report.notes,
      status: report.status,
    })
  }

  return (
    <div className="card-grid">
      <section className="panel">
        <p className="eyebrow">Personal weekly report</p>
        <h2>Create or update your weekly report</h2>
        <form onSubmit={handleSubmit} className="stacked-form">
          <input
            type="text"
            placeholder="Week / Date Range"
            value={form.week}
            onChange={(event) => setForm({ ...form, week: event.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Project or category"
            value={form.project}
            onChange={(event) => setForm({ ...form, project: event.target.value })}
            required
          />
          <textarea
            placeholder="Tasks completed"
            value={form.tasksCompleted}
            onChange={(event) => setForm({ ...form, tasksCompleted: event.target.value })}
            required
          />
          <textarea
            placeholder="Tasks planned for next week"
            value={form.tasksPlanned}
            onChange={(event) => setForm({ ...form, tasksPlanned: event.target.value })}
          />
          <textarea
            placeholder="Blockers / challenges"
            value={form.blockers}
            onChange={(event) => setForm({ ...form, blockers: event.target.value })}
          />
          <input
            type="number"
            placeholder="Hours worked"
            value={form.hoursWorked}
            onChange={(event) => setForm({ ...form, hoursWorked: event.target.value })}
          />
          <textarea
            placeholder="Optional notes or links"
            value={form.notes}
            onChange={(event) => setForm({ ...form, notes: event.target.value })}
          />
          <button type="submit" className="primary-button">
            {selectedId ? 'Submit updated report' : 'Submit report'}
          </button>
        </form>
      </section>

      <section className="panel">
        <p className="eyebrow">Report history</p>
        <h2>Your reports by week</h2>
        <div className="history-list">
          {memberReports.map((report) => (
            <article key={report.id} className="history-card">
              <div className="history-header">
                <strong>{report.week}</strong>
                <span className={`pill ${report.status}`}>{report.status}</span>
              </div>
              <p>{report.project}</p>
              <p>{report.tasksCompleted}</p>
              <button type="button" className="ghost-button" onClick={() => handleEdit(report)}>
                Edit
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default WeeklyReportPage
