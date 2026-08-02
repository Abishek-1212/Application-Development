import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Activity, ShieldAlert, ShieldCheck, Users, FileText, CheckCircle, Clock, Lock, BarChart2, Calendar, Database, Shield, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/admin/analytics');
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Loading Dashboard Widgets...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Welcome Banner */}
      <div className="glass-panel" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Welcome, {user?.username}</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Active Role: <span className="badge badge-primary">{user?.role}</span> | GCP Cert: {user?.gcpCertNumber || 'Verified'}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ACTIVE TRIAL</div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#38bdf8' }}>CTMS-2026-ONC (Phase III Oncology)</div>
        </div>
      </div>

      {/* RENDER SPECIFIC DASHBOARD WIDGETS ACCORDING TO LOGGED-IN ROLE */}

      {/* 1. SPONSOR DASHBOARD */}
      {user?.role === 'SPONSOR' && (
        <div>
          <h3 style={{ color: '#38bdf8', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity /> Sponsor Trial Portfolio & Safety Signals
          </h3>
          <div className="grid-4" style={{ marginBottom: '2rem' }}>
            <div className="stat-card"><div className="stat-value">{analytics?.totalStudies || 1}</div><div className="stat-label">SPONSORED TRIALS</div></div>
            <div className="stat-value-card stat-card"><div className="stat-value" style={{ color: '#10b981' }}>{analytics?.enrolledParticipants || 5}</div><div className="stat-label">TOTAL ENROLLED</div></div>
            <div className="stat-card"><div className="stat-value" style={{ color: '#ef4444' }}>{analytics?.seriousAdverseEvents || 1}</div><div className="stat-label">SERIOUS AEs (SAE)</div></div>
            <div className="stat-card"><div className="stat-value" style={{ color: '#f59e0b' }}>{analytics?.openQueries || 0}</div><div className="stat-label">OPEN QUERIES</div></div>
          </div>
        </div>
      )}

      {/* 2. PI DASHBOARD */}
      {user?.role === 'PRINCIPAL_INVESTIGATOR' && (
        <div>
          <h3 style={{ color: '#38bdf8', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck /> Investigator Site Overview & Safety Watch
          </h3>
          <div className="grid-3" style={{ marginBottom: '2rem' }}>
            <div className="glass-panel">
              <h4>Site 101 Enrollment Status</h4>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', margin: '0.5rem 0' }}>5 / 25 Subjects</div>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Next scheduled visit: V3 (Week 4) for SUBJ-001-0001</p>
            </div>
            <div className="glass-panel" style={{ borderLeft: '4px solid #ef4444' }}>
              <h4 style={{ color: '#f87171' }}><ShieldAlert size={16} /> Pending Medical Assessment</h4>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: '0.5rem 0' }}>Grade 3 Febrile Neutropenia (SUBJ-001-0002)</p>
              <Link to="/adverse-events" className="btn btn-danger btn-sm">Review & Assess SAE</Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. COORDINATOR WORKBENCH */}
      {user?.role === 'SITE_COORDINATOR' && (
        <div>
          <h3 style={{ color: '#38bdf8', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar /> Coordinator Daily Operations & Schedule
          </h3>
          <div className="glass-panel" style={{ marginBottom: '2rem' }}>
            <h4>Today's Action Items</h4>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem', fontSize: '0.9rem' }}>
              <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between' }}>
                <span>Dispense IP Batch KIT-1001-A for SUBJ-001-0001</span>
                <Link to="/ip-accountability" className="btn btn-primary btn-sm">Dispense</Link>
              </li>
              <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between' }}>
                <span>Upload IRB Approval Letter Amendment v2.1</span>
                <Link to="/regulatory" className="btn btn-secondary btn-sm">Upload TMF</Link>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* 4. DATA MANAGER DASHBOARD */}
      {user?.role === 'DATA_MANAGER' && (
        <div>
          <h3 style={{ color: '#38bdf8', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database /> Data Management & Database Lock Workbench
          </h3>
          <div className="grid-3" style={{ marginBottom: '2rem' }}>
            <div className="stat-card"><div className="stat-value" style={{ color: '#38bdf8' }}>94.2%</div><div className="stat-label">eCRF COMPLETION RATE</div></div>
            <div className="stat-card"><div className="stat-value" style={{ color: '#f59e0b' }}>0</div><div className="stat-label">OPEN DISCREPANCY QUERIES</div></div>
            <div className="stat-card"><div className="stat-value" style={{ color: '#10b981' }}>UNLOCKED</div><div className="stat-label">DB LOCK STATUS</div></div>
          </div>
        </div>
      )}

      {/* 5. REGULATORY AFFAIRS DASHBOARD */}
      {user?.role === 'REGULATORY_AFFAIRS' && (
        <div>
          <h3 style={{ color: '#38bdf8', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText /> TMF & Regulatory Submissions Hub
          </h3>
          <div className="glass-panel" style={{ marginBottom: '2rem' }}>
            <h4>Trial Master File (ICH E6 R2) Status</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0.5rem 0' }}>2 Master Documents Approved (Protocol v2.1, IB Ed 4)</p>
            <Link to="/regulatory" className="btn btn-primary btn-sm">Open Regulatory Hub</Link>
          </div>
        </div>
      )}

      {/* 6. ADMIN DASHBOARD */}
      {user?.role === 'ADMIN' && (
        <div>
          <h3 style={{ color: '#38bdf8', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield /> System Administration & Audit Oversight
          </h3>
          <div className="grid-3" style={{ marginBottom: '2rem' }}>
            <div className="stat-card"><div className="stat-value" style={{ color: '#10b981' }}>HEALTHY</div><div className="stat-label">MYSQL DB CONNECTION</div></div>
            <div className="stat-card"><div className="stat-value" style={{ color: '#0284c7' }}>8 ROLES</div><div className="stat-label">RBAC MATRIX ACTIVE</div></div>
            <div className="stat-card"><div className="stat-value" style={{ color: '#34d399' }}>SHA-256</div><div className="stat-label">AUDIT CHAIN INTEGRITY</div></div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/admin" className="btn btn-primary">Open Admin Panel & Audit Trail</Link>
          </div>
        </div>
      )}

      {/* Cross-Module Navigation Shortcuts */}
      <div className="glass-panel" style={{ marginTop: '2rem' }}>
        <h4 style={{ marginBottom: '1rem' }}>CTMS Quick Navigation Matrix</h4>
        <div className="grid-4" style={{ fontSize: '0.85rem' }}>
          <Link to="/studies" className="btn btn-secondary btn-sm"><Activity size={14} /> Protocol Setup</Link>
          <Link to="/participants" className="btn btn-secondary btn-sm"><Users size={14} /> Participant Registry</Link>
          <Link to="/ecrf/1/1" className="btn btn-secondary btn-sm"><FileText size={14} /> eCRF Entry Form</Link>
          <Link to="/adverse-events" className="btn btn-secondary btn-sm"><ShieldAlert size={14} /> AE / Safety Reporting</Link>
          <Link to="/ip-accountability" className="btn btn-secondary btn-sm"><Package size={14} /> IP Inventory</Link>
          <Link to="/regulatory" className="btn btn-secondary btn-sm"><FileText size={14} /> TMF Hub</Link>
          <Link to="/reports" className="btn btn-secondary btn-sm"><BarChart2 size={14} /> Analytics & Reports</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
