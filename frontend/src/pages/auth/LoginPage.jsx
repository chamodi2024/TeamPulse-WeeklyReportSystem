import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    const success = login(form.email, form.password)

    if (!success) {
      setError('Invalid email or password')
      return
    }

    navigate('/')
  }

  return (
    <section className="auth-card">
      <div className="panel">
        <p className="eyebrow">Authentication</p>
        <h2>Sign in</h2>
        <form onSubmit={handleSubmit} className="stacked-form">
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
          {error ? <p className="error-text">{error}</p> : null}
          <button type="submit" className="primary-button">
            Login
          </button>
        </form>
        <p className="helper-text">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </section>
  )
}

export default LoginPage
