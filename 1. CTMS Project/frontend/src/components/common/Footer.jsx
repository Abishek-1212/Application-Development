import React from 'react';
import { Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ background: '#0f172a', borderTop: '1px solid #1e293b', padding: '1.5rem 2rem', textAlign: 'center', color: '#64748b', fontSize: '0.8rem', marginTop: '3rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '0.4rem', color: '#94a3b8' }}>
        <Shield size={14} color="#0284c7" />
        <span>GCP Compliant System (ICH E6 R2 | 21 CFR Part 11 Electronic Records & Signatures)</span>
      </div>
      <div>© 2026 Clinical Trial Management System (CTMS). All rights reserved.</div>
    </footer>
  );
};

export default Footer;
