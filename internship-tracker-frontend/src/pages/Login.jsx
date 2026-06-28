import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Single handler for all inputs - [e.target.name] is a computed property key
  // So this one function updates any field by name without a separate handler each
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // stop browser's default form submission (page reload)
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', formData);
      // data.token and data.user come from your Express backend response
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      // err.response.data.message is the { message: '...' } from your Express errorHandler
      // The fallback covers network errors where err.response is undefined
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false); // always runs, even if request succeeds
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '2rem' }}>
      <h2>Login</h2>

      {error && (
        <p style={{ color: 'red', background: '#fff0f0', padding: '0.5rem', borderRadius: '4px' }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '0.75rem', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;