import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { UserPlus, Award } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'SUB_INVESTIGATOR',
    institutionalAffiliation: '',
    gcpCertNumber: '',
    gcpExpiryDate: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/register', formData);
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '540px', margin: '3rem auto', padding: '0 1rem' }}>
      <div className="glass-panel">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>GCP Staff Registration</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Register with GCP training credentials</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '0.65rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="grid-2">
            <div className="form-group">
              <label>Username</label>
              <input type="text" name="username" className="input-control" value={formData.username} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" className="input-control" value={formData.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" className="input-control" value={formData.password} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select name="role" className="input-control" value={formData.role} onChange={handleChange} required>
                <option value="SPONSOR">Sponsor</option>
                <option value="PRINCIPAL_INVESTIGATOR">Principal Investigator (PI)</option>
                <option value="SUB_INVESTIGATOR">Sub-Investigator</option>
                <option value="SITE_COORDINATOR">Site Coordinator</option>
                <option value="DATA_MANAGER">Data Manager</option>
                <option value="REGULATORY_AFFAIRS">Regulatory Affairs Officer</option>
                <option value="ADMIN">System Administrator</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Institutional / Hospital Affiliation</label>
            <input type="text" name="institutionalAffiliation" className="input-control" value={formData.institutionalAffiliation} onChange={handleChange} placeholder="e.g. Johns Hopkins Medicine" />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label><Award size={14} style={{ display: 'inline' }} /> GCP Cert Number</label>
              <input type="text" name="gcpCertNumber" className="input-control" value={formData.gcpCertNumber} onChange={handleChange} placeholder="e.g. GCP-2026-9812" />
            </div>

            <div className="form-group">
              <label>GCP Cert Expiry Date</label>
              <input type="date" name="gcpExpiryDate" className="input-control" value={formData.gcpExpiryDate} onChange={handleChange} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            {loading ? 'Registering...' : <><UserPlus size={18} /> Register GCP Account</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
