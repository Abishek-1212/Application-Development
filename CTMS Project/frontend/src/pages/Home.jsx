import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Users, Database, FileSpreadsheet, Lock } from 'lucide-react';

const Home = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div className="badge badge-primary" style={{ marginBottom: '1rem', padding: '0.4rem 1rem' }}>
          <ShieldCheck size={14} /> 21 CFR Part 11 & ICH E6(R2) Certified Platform
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem', lineHeight: 1.2 }}>
          Clinical Trial Management System
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '750px', margin: '0 auto 2rem' }}>
          End-to-end GCP-compliant trial execution for pharmaceutical sponsors, principal investigators, site coordinators, and clinical participants.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link to="/login" className="btn btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>
            <Lock size={18} /> Staff Portal Login
          </Link>
          <Link to="/register" className="btn btn-secondary" style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>
            Create Staff Account
          </Link>
        </div>
      </div>

      {/* Platform Stats Strip */}
      <div className="grid-4" style={{ marginBottom: '4rem' }}>
        <div className="stat-card">
          <div>
            <div className="stat-label">ACTIVE CLINICAL TRIALS</div>
            <div className="stat-value" style={{ color: '#0284c7' }}>12</div>
          </div>
          <Activity size={32} color="#0284c7" />
        </div>
        <div className="stat-card">
          <div>
            <div className="stat-label">ENROLLED SUBJECTS</div>
            <div className="stat-value" style={{ color: '#10b981' }}>1,248</div>
          </div>
          <Users size={32} color="#10b981" />
        </div>
        <div className="stat-card">
          <div>
            <div className="stat-label">eCRF DATA POINTS</div>
            <div className="stat-value" style={{ color: '#f59e0b' }}>450.8K</div>
          </div>
          <FileSpreadsheet size={32} color="#f59e0b" />
        </div>
        <div className="stat-card">
          <div>
            <div className="stat-label">AUDIT LOG INTEGRITY</div>
            <div className="stat-value" style={{ color: '#38bdf8' }}>100% SHA256</div>
          </div>
          <Database size={32} color="#38bdf8" />
        </div>
      </div>

      {/* Quick Demo Credentials */}
      <div className="glass-panel">
        <h3 style={{ color: '#38bdf8', marginBottom: '1rem', textAlign: 'center' }}>Demo Login Credentials (8 GCP Roles Pre-Seeded)</h3>
        <div className="grid-4" style={{ fontSize: '0.85rem' }}>
          <div style={{ background: '#0f172a', padding: '0.75rem', borderRadius: '6px' }}>
            <strong style={{ color: '#f8fafc' }}>Admin:</strong> admin / Demo@1234
          </div>
          <div style={{ background: '#0f172a', padding: '0.75rem', borderRadius: '6px' }}>
            <strong style={{ color: '#f8fafc' }}>Sponsor:</strong> sponsor / Demo@1234
          </div>
          <div style={{ background: '#0f172a', padding: '0.75rem', borderRadius: '6px' }}>
            <strong style={{ color: '#f8fafc' }}>PI:</strong> pi_user / Demo@1234
          </div>
          <div style={{ background: '#0f172a', padding: '0.75rem', borderRadius: '6px' }}>
            <strong style={{ color: '#f8fafc' }}>Sub-Inv:</strong> subinv / Demo@1234
          </div>
          <div style={{ background: '#0f172a', padding: '0.75rem', borderRadius: '6px' }}>
            <strong style={{ color: '#f8fafc' }}>Coordinator:</strong> coordinator / Demo@1234
          </div>
          <div style={{ background: '#0f172a', padding: '0.75rem', borderRadius: '6px' }}>
            <strong style={{ color: '#f8fafc' }}>Data Mgr:</strong> datamanager / Demo@1234
          </div>
          <div style={{ background: '#0f172a', padding: '0.75rem', borderRadius: '6px' }}>
            <strong style={{ color: '#f8fafc' }}>Reg Affairs:</strong> regaffairs / Demo@1234
          </div>
          <div style={{ background: '#0f172a', padding: '0.75rem', borderRadius: '6px' }}>
            <strong style={{ color: '#f8fafc' }}>Participant:</strong> participant1 / Demo@1234
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
