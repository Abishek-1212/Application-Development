import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Shield, Users, Database, Activity, Search, CheckCircle, AlertTriangle, Lock } from 'lucide-react';

const AdminPanel = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [auditRes, analyticsRes, healthRes] = await Promise.all([
        api.get('/admin/audit-logs'),
        api.get('/admin/analytics'),
        api.get('/admin/system-health'),
      ]);
      setAuditLogs(auditRes.data?.content || auditRes.data || []);
      setAnalytics(analyticsRes.data);
      setSystemHealth(healthRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = auditLogs.filter((log) =>
    !searchTerm ||
    log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.entityType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(log.userId).includes(searchTerm)
  );

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Loading Admin Panel...</div>;

  const tabs = [
    { id: 'overview', label: 'System Overview', icon: <Activity size={15} /> },
    { id: 'audit', label: 'Audit Trail', icon: <Database size={15} /> },
    { id: 'users', label: 'User Management', icon: <Users size={15} /> },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield color="#0284c7" size={28} /> System Administration Panel
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          Full platform control — RBAC, audit oversight, system configuration
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid #334155', paddingBottom: '0' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '8px 8px 0 0', gap: '6px' }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div>
          {/* System Health */}
          <div className="glass-panel" style={{ marginBottom: '2rem', borderLeft: '4px solid #10b981' }}>
            <h3 style={{ color: '#34d399', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={18} /> System Health Status
            </h3>
            <div className="grid-4">
              {systemHealth && Object.entries(systemHealth).map(([key, val]) => (
                <div key={key} style={{ background: '#0f172a', padding: '0.85rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399' }}>{String(val)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics Summary */}
          {analytics && (
            <div>
              <h3 style={{ color: '#38bdf8', marginBottom: '1rem' }}>Platform Analytics Summary</h3>
              <div className="grid-4" style={{ marginBottom: '2rem' }}>
                <div className="stat-card">
                  <div>
                    <div className="stat-value" style={{ color: '#0284c7' }}>{analytics.totalStudies}</div>
                    <div className="stat-label">TOTAL STUDIES</div>
                  </div>
                  <Activity size={28} color="#0284c7" />
                </div>
                <div className="stat-card">
                  <div>
                    <div className="stat-value" style={{ color: '#10b981' }}>{analytics.enrolledParticipants}</div>
                    <div className="stat-label">ENROLLED SUBJECTS</div>
                  </div>
                  <Users size={28} color="#10b981" />
                </div>
                <div className="stat-card">
                  <div>
                    <div className="stat-value" style={{ color: '#ef4444' }}>{analytics.seriousAdverseEvents}</div>
                    <div className="stat-label">SERIOUS AEs (SAE)</div>
                  </div>
                  <AlertTriangle size={28} color="#ef4444" />
                </div>
                <div className="stat-card">
                  <div>
                    <div className="stat-value" style={{ color: '#f59e0b' }}>{analytics.openQueries}</div>
                    <div className="stat-label">OPEN QUERIES</div>
                  </div>
                  <Database size={28} color="#f59e0b" />
                </div>
              </div>

              <div className="grid-4">
                <div className="stat-card">
                  <div>
                    <div className="stat-value">{analytics.totalParticipants}</div>
                    <div className="stat-label">TOTAL PARTICIPANTS</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div>
                    <div className="stat-value">{analytics.totalAdverseEvents}</div>
                    <div className="stat-label">TOTAL AEs</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div>
                    <div className="stat-value" style={{ color: '#ef4444' }}>{analytics.pendingSaeCount}</div>
                    <div className="stat-label">PENDING SAE REPORTS</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div>
                    <div className="stat-value">{analytics.totalDeviations}</div>
                    <div className="stat-label">PROTOCOL DEVIATIONS</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System Config Info */}
          <div className="glass-panel" style={{ marginTop: '2rem' }}>
            <h3 style={{ color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={18} /> Security & Compliance Configuration
            </h3>
            <div className="grid-2" style={{ fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#0f172a', borderRadius: '6px' }}>
                  <span style={{ color: '#94a3b8' }}>Session Timeout</span>
                  <span style={{ color: '#34d399', fontWeight: 600 }}>15 minutes (participant data)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#0f172a', borderRadius: '6px' }}>
                  <span style={{ color: '#94a3b8' }}>JWT Expiry (Staff)</span>
                  <span style={{ color: '#34d399', fontWeight: 600 }}>8 hours</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#0f172a', borderRadius: '6px' }}>
                  <span style={{ color: '#94a3b8' }}>JWT Expiry (Participant)</span>
                  <span style={{ color: '#34d399', fontWeight: 600 }}>24 hours</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#0f172a', borderRadius: '6px' }}>
                  <span style={{ color: '#94a3b8' }}>Max Login Attempts</span>
                  <span style={{ color: '#fbbf24', fontWeight: 600 }}>5 (then 15-min lockout)</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#0f172a', borderRadius: '6px' }}>
                  <span style={{ color: '#94a3b8' }}>Password Expiry</span>
                  <span style={{ color: '#34d399', fontWeight: 600 }}>60 days</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#0f172a', borderRadius: '6px' }}>
                  <span style={{ color: '#94a3b8' }}>Audit Log Integrity</span>
                  <span style={{ color: '#34d399', fontWeight: 600 }}>SHA-256 Hash Chain</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#0f172a', borderRadius: '6px' }}>
                  <span style={{ color: '#94a3b8' }}>Encryption (PII)</span>
                  <span style={{ color: '#34d399', fontWeight: 600 }}>AES-256 (arm_assignment)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#0f172a', borderRadius: '6px' }}>
                  <span style={{ color: '#94a3b8' }}>Compliance Standard</span>
                  <span style={{ color: '#38bdf8', fontWeight: 600 }}>21 CFR Part 11 / ICH E6(R2)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AUDIT TRAIL TAB */}
      {activeTab === 'audit' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ color: '#38bdf8' }}>SHA-256 Hash-Chained Audit Trail</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                {auditLogs.length} immutable records — insert-only, tamper-evident
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '0.5rem 0.85rem' }}>
              <Search size={16} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search action, entity, user ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ background: 'transparent', border: 'none', outline: 'none', color: '#f8fafc', fontSize: '0.875rem', width: '220px' }}
              />
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Timestamp</th>
                  <th>User ID</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Entity ID</th>
                  <th>Old Value</th>
                  <th>New Value</th>
                  <th>SHA-256 Hash (truncated)</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.slice().reverse().map((log) => (
                  <tr key={log.id}>
                    <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{log.id}</td>
                    <td style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : '—'}
                    </td>
                    <td>{log.userId}</td>
                    <td>
                      <span className={`badge ${
                        log.action?.includes('LOGIN') ? 'badge-success' :
                        log.action?.includes('LOCK') || log.action?.includes('SAE') ? 'badge-danger' :
                        log.action?.includes('MODIFY') ? 'badge-warning' : 'badge-primary'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ color: '#cbd5e1' }}>{log.entityType}</td>
                    <td>{log.entityId}</td>
                    <td style={{ fontSize: '0.75rem', color: '#94a3b8', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.oldValue || '—'}
                    </td>
                    <td style={{ fontSize: '0.75rem', color: '#cbd5e1', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.newValue || '—'}
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#38bdf8' }}>
                      {log.electronicSignature ? log.electronicSignature.substring(0, 20) + '...' : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* USER MANAGEMENT TAB */}
      {activeTab === 'users' && (
        <div>
          <div className="glass-panel">
            <h3 style={{ color: '#38bdf8', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} /> Registered Users & Role Matrix
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              All 8 GCP roles are pre-seeded. Use <strong style={{ color: '#f8fafc' }}>/api/auth/register</strong> to add new staff accounts.
            </p>

            <div className="grid-2">
              {[
                { role: 'ADMIN', user: 'admin', color: '#ef4444', desc: 'Full platform control, audit oversight, user management' },
                { role: 'SPONSOR', user: 'sponsor', color: '#f59e0b', desc: 'Trial oversight, safety monitoring, budget, protocol approval' },
                { role: 'PRINCIPAL_INVESTIGATOR', user: 'pi_john', color: '#0284c7', desc: 'Protocol implementation, consent oversight, AE medical assessment' },
                { role: 'SUB_INVESTIGATOR', user: 'sub_sarah', color: '#38bdf8', desc: 'Screening, enrollment, clinical assessments, eCRF, IP dispensing' },
                { role: 'SITE_COORDINATOR', user: 'coord_mike', color: '#10b981', desc: 'Day-to-day operations, scheduling, IP inventory, regulatory docs' },
                { role: 'DATA_MANAGER', user: 'datamgr_lisa', color: '#8b5cf6', desc: 'eCRF review, query management, database lock' },
                { role: 'REGULATORY_AFFAIRS', user: 'reg_david', color: '#ec4899', desc: 'Regulatory submissions, TMF, authority correspondence' },
                { role: 'PARTICIPANT', user: 'part_alice', color: '#34d399', desc: 'Consent access, appointment scheduling, symptom diary' },
              ].map(({ role, user, color, desc }) => (
                <div key={role} style={{ background: '#0f172a', border: `1px solid ${color}33`, borderLeft: `4px solid ${color}`, borderRadius: '8px', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 700, color, fontSize: '0.85rem' }}>{role}</span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>@{user}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
