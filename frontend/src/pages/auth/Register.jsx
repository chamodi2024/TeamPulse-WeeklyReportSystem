import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../../api/authApi'
import { useAuth } from '../../context/AuthContext'

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'MEMBER' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data } = await registerUser(formData)
      const success = login(data)

      if (!success) {
        throw new Error('Registration failed')
      }

      if (data.user?.role === 'MANAGER') {
        navigate('/manager/dashboard')
      } else {
        navigate('/member/reports')
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <div className="panel">
        <p className="eyebrow">Authentication</p>
        <h2>Create account</h2>
        {error ? <div className="error-text">{error}</div> : null}
        <form onSubmit={handleSubmit} className="stacked-form">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full name" required />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" minLength={6} required />
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="MEMBER">Team Member</option>
            <option value="MANAGER">Manager</option>
          </select>
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="helper-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
