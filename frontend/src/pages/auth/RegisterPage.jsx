import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' })
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    const success = register(form)

    if (!success) {
      setError('An account already exists for this email')
      return
    }

    navigate('/')
  }

  return (
    <section className="auth-card">
      <div className="panel">
        <p className="eyebrow">Authentication</p>
        <h2>Create account</h2>
        <form onSubmit={handleSubmit} className="stacked-form">
          <input
            type="text"
            placeholder="Full name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
          <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
            <option value="member">Team Member</option>
            <option value="manager">Manager</option>
          </select>
          {error ? <p className="error-text">{error}</p> : null}
          <button type="submit" className="primary-button">
            Register
          </button>
        </form>
        <p className="helper-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  )
}

export default RegisterPage
