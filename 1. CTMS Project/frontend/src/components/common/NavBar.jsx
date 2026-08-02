import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Activity, ShieldAlert, Award, LogOut, User, FileText, Package, AlertTriangle, FileSpreadsheet, Settings } from 'lucide-react';

const NavBar = () => {
  const { user, logout, activeStudyId, setActiveStudyId, hasRole, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#f8fafc', fontWeight: 800, fontSize: '1.1rem' }}>
          <Activity color="#0284c7" size={24} />
          <span>CTMS <span style={{ color: '#0284c7', fontSize: '0.8rem', fontWeight: 600 }}>v1.0</span></span>
        </Link>

        {/* Multi-Study Selector */}
        <select
          value={activeStudyId}
          onChange={(e) => setActiveStudyId(Number(e.target.value))}
          style={{ background: '#0f172a', color: '#f8fafc', border: '1px solid #334155', padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 500 }}
        >
          <option value={1}>CTMS-2026-ONC (Phase III Solid Tumors)</option>
          <option value={2}>CTMS-2026-CV (Phase II Cardiology)</option>
        </select>
      </div>

      {/* Navigation Links based on RBAC */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', fontWeight: 600 }}>
        {hasRole(['ADMIN', 'SPONSOR', 'PRINCIPAL_INVESTIGATOR', 'SUB_INVESTIGATOR', 'SITE_COORDINATOR']) && (
          <Link to="/studies" style={{ color: '#cbd5e1' }}>Studies</Link>
        )}
        {hasRole(['ADMIN', 'SITE_COORDINATOR', 'SUB_INVESTIGATOR', 'PRINCIPAL_INVESTIGATOR', 'DATA_MANAGER']) && (
          <Link to="/participants" style={{ color: '#cbd5e1' }}>Participants</Link>
        )}
        {hasRole(['ADMIN', 'SUB_INVESTIGATOR', 'PRINCIPAL_INVESTIGATOR', 'SITE_COORDINATOR', 'SPONSOR']) && (
          <Link to="/adverse-events" style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '4px' }}>
            AE / Safety
          </Link>
        )}
        {hasRole(['ADMIN', 'SITE_COORDINATOR', 'SUB_INVESTIGATOR', 'PRINCIPAL_INVESTIGATOR', 'SPONSOR']) && (
          <Link to="/ip-accountability" style={{ color: '#cbd5e1' }}>IP Supply</Link>
        )}
        {hasRole(['ADMIN', 'REGULATORY_AFFAIRS', 'PRINCIPAL_INVESTIGATOR', 'SITE_COORDINATOR', 'SPONSOR']) && (
          <Link to="/regulatory" style={{ color: '#cbd5e1' }}>TMF / Regulatory</Link>
        )}
        <Link to="/reports" style={{ color: '#cbd5e1' }}>Reports</Link>
        {user?.role === 'ADMIN' && (
          <Link to="/admin" style={{ color: '#38bdf8' }}>Admin</Link>
        )}
        {user?.role === 'PARTICIPANT' && (
          <Link to="/participant-portal" style={{ color: '#34d399' }}>My Patient Portal</Link>
        )}
      </div>

      {/* User Badges & Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Real-time SAE Alert Badge */}
        <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
          <AlertTriangle size={14} /> 1 SAE Overdue Watch
        </div>

        {/* GCP Training Expiry Warning Badge */}
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Award size={14} /> GCP Valid
        </div>

        {/* User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: '1px solid #334155', paddingLeft: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>{user?.username}</div>
            <div className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>{user?.role}</div>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Logout" style={{ padding: '0.4rem' }}>
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
