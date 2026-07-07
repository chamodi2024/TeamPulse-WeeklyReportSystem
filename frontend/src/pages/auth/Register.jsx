import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/common/Logo';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'MEMBER',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await registerUser(formData);
      login(data);
      navigate(data.role === 'MANAGER' ? '/manager/dashboard' : '/member/reports');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface-50">
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-brand-950 via-brand-800 to-brand-600 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-400/20 rounded-full blur-3xl"></div>

        <Logo light />

        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Join your team's<br />reporting workflow.
          </h1>
          <p className="text-brand-100 text-base leading-relaxed max-w-sm">
            One consistent report format for the whole team — comparable, trackable, and always up to date.
          </p>
        </div>

        <p className="relative z-10 text-brand-200 text-sm">
          © 2026 TeamPulse. Built for internship assignment.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <Logo />
          </div>

          <h2 className="text-2xl font-bold text-surface-900 mb-1">Create your account</h2>
          <p className="text-gray-500 text-sm mb-8">Set up access to your team dashboard</p>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2.5 rounded-xl mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-surface-900 mb-1.5">Full name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                placeholder="Chamodi Perera"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-surface-900 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-surface-900 mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-2.5 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-surface-900 mb-1.5">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {['MEMBER', 'MANAGER'].map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setFormData({ ...formData, role: r })}
                    className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition ${
                      formData.role === r
                        ? 'border-brand-600 bg-brand-50 text-brand-700'
                        : 'border-surface-200 text-gray-500 hover:border-surface-300'
                    }`}
                  >
                    {r === 'MEMBER' ? 'Team Member' : 'Manager'}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-soft"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}