import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import BlindedRoute from '../components/common/BlindedRoute';
import { UserPlus, Eye, Lock, ShieldCheck } from 'lucide-react';

const Participants = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unblinded, setUnblinded] = useState(false);
  const { activeStudyId, hasRole } = useAuth();

  const [newSubj, setNewSubj] = useState({
    studyId: activeStudyId,
    siteId: 1,
    consentVersion: 'v1.0',
    consentDate: new Date().toISOString().split('T')[0],
  });
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchParticipants();
  }, [activeStudyId, unblinded]);

  const fetchParticipants = async () => {
    try {
      const res = await api.get(`/participants/study/${activeStudyId}?unblind=${unblinded}`);
      setParticipants(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/participants', newSubj);
      setShowAddModal(false);
      fetchParticipants();
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading Participants...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Participant Registry</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Pseudonymized Subject Records & Informed Consent Status</p>
        </div>
        {hasRole(['ADMIN', 'SITE_COORDINATOR', 'SUB_INVESTIGATOR', 'PRINCIPAL_INVESTIGATOR']) && (
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            <UserPlus size={18} /> Register Subject
          </button>
        )}
      </div>

      {/* Blinded Treatment Guard Alert */}
      <div style={{ marginBottom: '1.5rem' }}>
        <BlindedRoute onUnblindConfirm={() => setUnblinded(true)}>
          <div style={{ padding: '0.75rem', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', color: '#34d399', fontSize: '0.85rem' }}>
            <ShieldCheck size={16} style={{ display: 'inline', marginRight: '6px' }} />
            Emergency Unblinding Active. Treatment arm assignments are currently visible for medical evaluation.
          </div>
        </BlindedRoute>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Subject ID</th>
              <th>Site</th>
              <th>Enrollment Date</th>
              <th>Status</th>
              <th>Informed Consent</th>
              <th>Treatment Arm (Blinded)</th>
              <th>eCRF Entry</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p) => (
              <tr key={p.id}>
                <td>
                  <strong style={{ color: '#38bdf8' }}>{p.subjectId}</strong>
                </td>
                <td>{p.siteName}</td>
                <td>{p.enrollmentDate}</td>
                <td>
                  <span className={`badge ${p.status === 'ENROLLED' || p.status === 'ACTIVE' ? 'badge-success' : 'badge-secondary'}`}>
                    {p.status}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{p.consentVersion} ({p.consentDate})</span>
                </td>
                <td>
                  <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#f59e0b' }}>
                    {p.armAssignment || '*** BLINDED ***'}
                  </span>
                </td>
                <td>
                  <Link to={`/ecrf/${p.id}/1`} className="btn btn-secondary btn-sm">
                    <Eye size={14} /> Open eCRF (V1)
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Register New Subject</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>Subject ID will be system-generated under GCP rules.</p>
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Site ID</label>
                <select className="input-control" value={newSubj.siteId} onChange={(e) => setNewSubj({ ...newSubj, siteId: Number(e.target.value) })}>
                  <option value={1}>Site 101 - Metropolitan Cancer Institute</option>
                  <option value={2}>Site 102 - St. Jude Clinical Research Center</option>
                </select>
              </div>
              <div className="form-group">
                <label>Consent Version</label>
                <input type="text" className="input-control" value={newSubj.consentVersion} onChange={(e) => setNewSubj({ ...newSubj, consentVersion: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Consent Date</label>
                <input type="date" className="input-control" value={newSubj.consentDate} onChange={(e) => setNewSubj({ ...newSubj, consentDate: e.target.value })} required />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Register</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Participants;
