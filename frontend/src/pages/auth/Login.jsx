import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../../api/authApi'
import { useAuth } from '../../context/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data } = await loginUser({ email, password })
      const success = login(data)

      if (!success) {
        throw new Error('Login failed')
      }

      if (data.user?.role === 'MANAGER') {
        navigate('/manager/dashboard')
      } else {
        navigate('/member/reports')
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <div className="panel">
        <p className="eyebrow">Authentication</p>
        <h2>Login</h2>
        {error ? <div className="error-text">{error}</div> : null}
        <form onSubmit={handleSubmit} className="stacked-form">
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" required />
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" required />
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="helper-text">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
