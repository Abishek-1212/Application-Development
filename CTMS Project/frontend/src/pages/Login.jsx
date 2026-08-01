import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Lock, LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { username, password });
      login(res.data);
      if (res.data.role === 'PARTICIPANT') {
        navigate('/participant-portal');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials or account status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '4rem auto', padding: '0 1rem' }}>
      <div className="glass-panel">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ background: 'rgba(2, 132, 199, 0.2)', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Lock color="#0284c7" size={28} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>CTMS Secure Login</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Role-Based Access & GCP Compliance Portal</p>
        </div>

        {searchParams.get('expired') && (
          <div style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24', padding: '0.65rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertCircle size={16} /> Session expired after 15 minutes of inactivity. Please re-authenticate.
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '0.65rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              className="input-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="input-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}>
            {loading ? 'Authenticating...' : <><LogIn size={18} /> Authenticate Session</>}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
          Quick Demo Presets:
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center', marginTop: '0.5rem' }}>
            {[
              { u: 'admin', p: 'Demo@1234' },
              { u: 'sponsor', p: 'Demo@1234' },
              { u: 'pi_user', p: 'Demo@1234' },
              { u: 'subinv', p: 'Demo@1234' },
              { u: 'coordinator', p: 'Demo@1234' },
              { u: 'datamanager', p: 'Demo@1234' },
              { u: 'regaffairs', p: 'Demo@1234' },
              { u: 'participant1', p: 'Demo@1234' },
            ].map(({ u, p }) => (
              <button
                key={u}
                onClick={() => { setUsername(u); setPassword(p); }}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem' }}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
