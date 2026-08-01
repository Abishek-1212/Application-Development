import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, FileText, Activity, Heart, CheckCircle, Clock } from 'lucide-react';

const ParticipantPortal = () => {
  const { user, activeStudyId } = useAuth();
  const [aeList, setAeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Symptom diary state
  const [diary, setDiary] = useState({
    symptom: '',
    severity: 'MILD',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [diarySubmitted, setDiarySubmitted] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get(`/adverse-events/study/${activeStudyId}`);
      setAeList(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDiarySubmit = (e) => {
    e.preventDefault();
    const entry = { ...diary, id: Date.now(), submittedAt: new Date().toLocaleString() };
    setDiaryEntries((prev) => [entry, ...prev]);
    setDiary({ symptom: '', severity: 'MILD', date: new Date().toISOString().split('T')[0], notes: '' });
    setDiarySubmitted(true);
    setTimeout(() => setDiarySubmitted(false), 3000);
  };

  // Upcoming visits (static demo data — would be fetched from protocol visits in production)
  const upcomingVisits = [
    { visitName: 'Week 4 Follow-up (V3)', scheduledDate: 'In 14 days', visitCode: 'V3', type: 'TREATMENT', mandatory: true },
    { visitName: 'End of Study (V4)', scheduledDate: 'In 42 days', visitCode: 'V4', type: 'COMPLETION', mandatory: true },
  ];

  const consentDocs = [
    { title: 'Informed Consent Form v1.0', date: '2026-02-01', status: 'SIGNED', version: 'v1.0' },
    { title: 'Patient Information Sheet — CTMS-2026-ONC', date: '2026-02-01', status: 'ACKNOWLEDGED', version: 'v1.0' },
  ];

  const tabs = [
    { id: 'overview', label: 'My Overview', icon: <Activity size={15} /> },
    { id: 'diary', label: 'Symptom Diary', icon: <Heart size={15} /> },
    { id: 'appointments', label: 'Appointments', icon: <Calendar size={15} /> },
    { id: 'consent', label: 'My Consent Docs', icon: <FileText size={15} /> },
  ];

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Loading Patient Portal...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Welcome Banner */}
      <div className="glass-panel" style={{ marginBottom: '2rem', borderLeft: '4px solid #10b981' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Welcome, {user?.username}</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Study: <span style={{ color: '#38bdf8', fontWeight: 600 }}>CTMS-2026-ONC (Phase III Oncology)</span>
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>PARTICIPANT STATUS</div>
            <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '0.3rem 0.8rem' }}>ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ gap: '6px' }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div>
          <div className="grid-3" style={{ marginBottom: '2rem' }}>
            <div className="stat-card">
              <div>
                <div className="stat-value" style={{ color: '#10b981' }}>2</div>
                <div className="stat-label">UPCOMING VISITS</div>
              </div>
              <Calendar size={28} color="#10b981" />
            </div>
            <div className="stat-card">
              <div>
                <div className="stat-value" style={{ color: '#0284c7' }}>{diaryEntries.length}</div>
                <div className="stat-label">DIARY ENTRIES</div>
              </div>
              <Heart size={28} color="#0284c7" />
            </div>
            <div className="stat-card">
              <div>
                <div className="stat-value" style={{ color: '#34d399' }}>2</div>
                <div className="stat-label">SIGNED CONSENTS</div>
              </div>
              <CheckCircle size={28} color="#34d399" />
            </div>
          </div>

          <div className="glass-panel">
            <h3 style={{ color: '#38bdf8', marginBottom: '1rem' }}>Study Participation Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', background: '#0f172a', borderRadius: '6px' }}>
                <span style={{ color: '#94a3b8' }}>Enrollment Date</span>
                <span style={{ color: '#f8fafc', fontWeight: 600 }}>2026-02-01</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', background: '#0f172a', borderRadius: '6px' }}>
                <span style={{ color: '#94a3b8' }}>Consent Version</span>
                <span style={{ color: '#f8fafc', fontWeight: 600 }}>v1.0 (Signed)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', background: '#0f172a', borderRadius: '6px' }}>
                <span style={{ color: '#94a3b8' }}>Treatment Arm</span>
                <span style={{ color: '#fbbf24', fontWeight: 600 }}>BLINDED (Double-Blind Protocol)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', background: '#0f172a', borderRadius: '6px' }}>
                <span style={{ color: '#94a3b8' }}>Next Visit</span>
                <span style={{ color: '#34d399', fontWeight: 600 }}>V3 — Week 4 Follow-up (in 14 days)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', background: '#0f172a', borderRadius: '6px' }}>
                <span style={{ color: '#94a3b8' }}>Site Contact</span>
                <span style={{ color: '#f8fafc', fontWeight: 600 }}>Metropolitan Cancer Institute — 212-555-0199</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SYMPTOM DIARY TAB */}
      {activeTab === 'diary' && (
        <div className="grid-2">
          <div className="glass-panel">
            <h3 style={{ color: '#38bdf8', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Heart size={18} /> Log Symptom / Side Effect
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Report any symptoms or side effects you experience. Your care team will review these entries.
            </p>

            {diarySubmitted && (
              <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', padding: '0.65rem', borderRadius: '6px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={16} /> Symptom logged successfully. Your care team has been notified.
              </div>
            )}

            <form onSubmit={handleDiarySubmit}>
              <div className="form-group">
                <label>Symptom / Side Effect Description</label>
                <input
                  type="text"
                  className="input-control"
                  value={diary.symptom}
                  onChange={(e) => setDiary({ ...diary, symptom: e.target.value })}
                  placeholder="e.g. Mild nausea after morning dose"
                  required
                />
              </div>

              <div className="form-group">
                <label>Severity</label>
                <select className="input-control" value={diary.severity} onChange={(e) => setDiary({ ...diary, severity: e.target.value })}>
                  <option value="MILD">Mild — Does not interfere with daily activities</option>
                  <option value="MODERATE">Moderate — Some interference with daily activities</option>
                  <option value="SEVERE">Severe — Unable to perform daily activities</option>
                </select>
              </div>

              <div className="form-group">
                <label>Date of Symptom</label>
                <input
                  type="date"
                  className="input-control"
                  value={diary.date}
                  onChange={(e) => setDiary({ ...diary, date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Additional Notes (optional)</label>
                <textarea
                  className="input-control"
                  rows={2}
                  value={diary.notes}
                  onChange={(e) => setDiary({ ...diary, notes: e.target.value })}
                  placeholder="Any additional details..."
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <Heart size={16} /> Submit Diary Entry
              </button>
            </form>
          </div>

          <div className="glass-panel">
            <h3 style={{ color: '#f8fafc', marginBottom: '1rem' }}>My Diary History</h3>
            {diaryEntries.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>No diary entries yet. Use the form to log your first symptom.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {diaryEntries.map((entry) => (
                  <div key={entry.id} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <strong style={{ color: '#f8fafc' }}>{entry.symptom}</strong>
                      <span className={`badge ${entry.severity === 'MILD' ? 'badge-success' : entry.severity === 'MODERATE' ? 'badge-warning' : 'badge-danger'}`}>
                        {entry.severity}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {entry.date} — Submitted: {entry.submittedAt}
                    </div>
                    {entry.notes && <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.3rem' }}>{entry.notes}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* APPOINTMENTS TAB */}
      {activeTab === 'appointments' && (
        <div className="glass-panel">
          <h3 style={{ color: '#38bdf8', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} /> Upcoming Study Visits
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {upcomingVisits.map((visit, i) => (
              <div key={i} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '0.3rem' }}>{visit.visitName}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Type: {visit.type} | Code: {visit.visitCode} | {visit.mandatory ? '⚠️ Mandatory Visit' : 'Optional'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontWeight: 700 }}>
                    <Clock size={16} /> {visit.scheduledDate}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    Metropolitan Cancer Institute
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(2,132,199,0.1)', border: '1px solid rgba(2,132,199,0.3)', borderRadius: '8px', fontSize: '0.85rem', color: '#94a3b8' }}>
            <strong style={{ color: '#38bdf8' }}>Important:</strong> Please contact your site coordinator at least 48 hours before your visit if you need to reschedule. Missing mandatory visits may affect your participation in the study.
          </div>
        </div>
      )}

      {/* CONSENT DOCUMENTS TAB */}
      {activeTab === 'consent' && (
        <div className="glass-panel">
          <h3 style={{ color: '#38bdf8', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} /> My Informed Consent Documents
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {consentDocs.map((doc, i) => (
              <div key={i} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '0.3rem' }}>{doc.title}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Version: {doc.version} | Date: {doc.date}
                  </div>
                </div>
                <span className={`badge ${doc.status === 'SIGNED' ? 'badge-success' : 'badge-primary'}`}>
                  <CheckCircle size={12} /> {doc.status}
                </span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', fontSize: '0.85rem', color: '#94a3b8' }}>
            <strong style={{ color: '#34d399' }}>Your Rights:</strong> You have the right to withdraw from this study at any time without penalty. Contact your Principal Investigator or Site Coordinator for any questions about your participation.
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantPortal;
