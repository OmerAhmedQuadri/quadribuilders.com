import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../lib/api.js';

export default function AdminLogin() {
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/admin/login', creds);
      localStorage.setItem('qb_admin_token', data.token);
      navigate('/admin');
    } catch {
      setError('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-sm bg-surface border border-border p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <img src="/logo.png" alt="QuadriBuilders" className="h-8 w-auto mb-8" />
        <h1 className="font-display text-2xl font-semibold mb-6">Admin Panel</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={creds.username}
            onChange={(e) => setCreds((p) => ({ ...p, username: e.target.value }))}
            className="input-field"
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Password"
            value={creds.password}
            onChange={(e) => setCreds((p) => ({ ...p, password: e.target.value }))}
            className="input-field"
            autoComplete="current-password"
          />
          {error && <p className="text-xs text-danger">{error}</p>}
          <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
