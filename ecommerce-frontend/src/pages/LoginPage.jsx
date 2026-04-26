import { useState }          from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser }         from '../api/authApi';
import { useAuth }           from '../context/AuthContext';
import { toast }             from 'react-toastify';

const LoginPage = () => {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(form);
      const { token, ...userData } = res.data;
      login(userData, token);
      toast.success(`Welcome back, ${userData.name}! 👋`);
      navigate(userData.role === 'ADMIN' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '90vh', background: '#f8f9fa' }}
    >
      <div className="card shadow-lg border-0 p-4"
           style={{ width: '100%', maxWidth: '420px' }}>

        {/* Header */}
        <div className="text-center mb-4">
          <span style={{ fontSize: '3rem' }}>🛒</span>
          <h3 className="fw-bold mt-2">ShopEase</h3>
          <p className="text-muted">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              name="email"
              className="form-control form-control-lg"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              className="form-control form-control-lg"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-100"
            disabled={loading}
          >
            {loading
              ? <><span className="spinner-border spinner-border-sm me-2" />
                  Signing in...</>
              : '🔐 Sign In'}
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary fw-bold">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;