export const initialUsers = [
  {
    id: 1,
    name: 'Nadun Perera',
    email: 'nadun@example.com',
    password: 'member123',
    role: 'member',
  },
  {
    id: 2,
    name: 'Chamika Silva',
    email: 'chamika@example.com',
    password: 'member123',
    role: 'member',
  },
  {
    id: 3,
    name: 'Ravi Senanayake',
    email: 'ravi@example.com',
    password: 'manager123',
    role: 'manager',
  },
]

export const initialProjects = [
  { id: 1, name: 'Client A', category: 'Client Delivery' },
  { id: 2, name: 'Internal Tooling', category: 'Internal' },
  { id: 3, name: 'R&D', category: 'Research' },
]

export const initialReports = [
  {
    id: 1,
    userId: 1,
    week: '2026-W27',
    project: 'Client A',
    tasksCompleted: 'Delivered onboarding checklist, reviewed API contracts.',
    tasksPlanned: 'Prepare sprint demo, finalize dashboard copy.',
    blockers: 'Waiting on client feedback for final visuals.',
    hoursWorked: 38,
    notes: 'https://drive.google.com/weekly-notes',
    status: 'submitted',
  },
  {
    id: 2,
    userId: 2,
    week: '2026-W27',
    project: 'Internal Tooling',
    tasksCompleted: 'Finished data import workflow and polished settings page.',
    tasksPlanned: 'Add audit logs and test dark mode.',
    blockers: 'None',
    hoursWorked: 40,
    notes: '',
    status: 'submitted',
  },
  {
    id: 3,
    userId: 2,
    week: '2026-W26',
    project: 'R&D',
    tasksCompleted: 'Investigated AI summarization prompt tuning.',
    tasksPlanned: 'Create prototype metrics panel.',
    blockers: 'Need additional sample data.',
    hoursWorked: 32,
    notes: 'Shared experiment notes.',
    status: 'pending',
  },
]
