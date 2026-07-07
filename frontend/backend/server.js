import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

const users = [
  { id: 1, name: 'Nadun Perera', email: 'nadun@example.com', role: 'member' },
  { id: 2, name: 'Chamika Silva', email: 'chamika@example.com', role: 'member' },
  { id: 3, name: 'Ravi Senanayake', email: 'ravi@example.com', role: 'manager' },
]

const reports = [
  {
    id: 1,
    userId: 1,
    week: '2026-W27',
    project: 'Client A',
    tasksCompleted: 'Delivered onboarding checklist',
    status: 'submitted',
  },
]

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/users', (_req, res) => {
  res.json(users)
})

app.get('/api/reports', (_req, res) => {
  res.json(reports)
})

app.post('/api/reports', (req, res) => {
  const payload = req.body
  const newReport = { id: Date.now(), ...payload }
  reports.push(newReport)
  res.status(201).json(newReport)
})

app.listen(5000, () => {
  console.log('Backend listening on http://localhost:5000')
})
