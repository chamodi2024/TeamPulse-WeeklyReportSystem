import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

function ProjectsPage() {
  const { projects, addProject, updateProject, deleteProject } = useAuth()
  const [form, setForm] = useState({ name: '', category: '' })
  const [selectedId, setSelectedId] = useState(null)

  const handleSubmit = (event) => {
    event.preventDefault()

    if (selectedId) {
      updateProject(selectedId, form)
    } else {
      addProject(form)
    }

    setForm({ name: '', category: '' })
    setSelectedId(null)
  }

  const handleEdit = (project) => {
    setSelectedId(project.id)
    setForm({ name: project.name, category: project.category })
  }

  return (
    <div className="card-grid">
      <section className="panel">
        <p className="eyebrow">Projects & categories</p>
        <h2>Manage projects</h2>
        <form onSubmit={handleSubmit} className="stacked-form">
          <input
            type="text"
            placeholder="Project name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
            required
          />
          <button type="submit" className="primary-button">
            {selectedId ? 'Update project' : 'Add project'}
          </button>
        </form>
      </section>

      <section className="panel">
        <h3>Existing projects</h3>
        <div className="history-list">
          {projects.map((project) => (
            <article key={project.id} className="history-card">
              <div className="history-header">
                <strong>{project.name}</strong>
                <span>{project.category}</span>
              </div>
              <div className="inline-actions">
                <button type="button" className="ghost-button" onClick={() => handleEdit(project)}>
                  Edit
                </button>
                <button type="button" className="ghost-button" onClick={() => deleteProject(project.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default ProjectsPage
