import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ElectronicSignatureModal from '../components/common/ElectronicSignatureModal';
import { Activity, Plus, Lock, Unlock, ShieldCheck } from 'lucide-react';

const Studies = () => {
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lockModalStudyId, setLockModalStudyId] = useState(null);
  const { hasRole } = useAuth();

  useEffect(() => {
    fetchStudies();
  }, []);

  const fetchStudies = async () => {
    try {
      const res = await api.get('/studies');
      setStudies(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLockDatabase = async (sigData) => {
    if (!lockModalStudyId) return;
    try {
      await api.post(`/studies/${lockModalStudyId}/lock`);
      setLockModalStudyId(null);
      fetchStudies();
      alert('Database for study locked successfully. All eCRF records are now read-only per GCP.');
    } catch (err) {
      alert(err.response?.data?.message || 'Error locking database');
    }
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading Studies...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Clinical Trial Protocols</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Governance, Protocol Versions, and Database Lock Status</p>
        </div>
        {hasRole(['ADMIN', 'SPONSOR']) && (
          <Link to="/studies/new" className="btn btn-primary">
            <Plus size={18} /> Setup New Trial Protocol
          </Link>
        )}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Protocol Title</th>
              <th>Phase</th>
              <th>Therapeutic Area</th>
              <th>Protocol Ver.</th>
              <th>Target / Enrolled</th>
              <th>DB Lock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {studies.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>
                  <strong style={{ color: '#f8fafc' }}>{s.studyTitle}</strong>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Sponsor ID: {s.sponsorId}</div>
                </td>
                <td><span className="badge badge-primary">{s.phase}</span></td>
                <td>{s.therapeuticArea}</td>
                <td>{s.protocolVersion}</td>
                <td><strong>{s.actualEnrollment}</strong> / {s.targetEnrollment}</td>
                <td>
                  {s.databaseLocked ? (
                    <span className="badge badge-danger" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Lock size={12} /> LOCKED
                    </span>
                  ) : (
                    <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Unlock size={12} /> ACTIVE
                    </span>
                  )}
                </td>
                <td>
                  {!s.databaseLocked && hasRole(['ADMIN', 'SPONSOR', 'DATA_MANAGER', 'PRINCIPAL_INVESTIGATOR']) && (
                    <button onClick={() => setLockModalStudyId(s.id)} className="btn btn-danger btn-sm">
                      <Lock size={14} /> Lock DB
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ElectronicSignatureModal
        isOpen={!!lockModalStudyId}
        onClose={() => setLockModalStudyId(null)}
        onConfirm={handleLockDatabase}
        actionTitle="Irrevocable Database Lock"
      />
    </div>
  );
};

export default Studies;
