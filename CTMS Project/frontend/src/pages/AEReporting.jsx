import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, Clock, ShieldAlert, CheckCircle, Send } from 'lucide-react';

const AEReporting = () => {
  const [aeList, setAeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { activeStudyId, hasRole } = useAuth();

  const [formData, setFormData] = useState({
    participantId: 1,
    studyId: activeStudyId,
    aeDescription: '',
    onsetDate: new Date().toISOString().split('T')[0],
    severity: 'MODERATE',
    causality: 'POSSIBLE',
    isSerious: false,
    seriousCriteria: '',
    outcome: 'RECOVERING',
  });

  useEffect(() => {
    fetchAEs();
  }, [activeStudyId]);

  const fetchAEs = async () => {
    try {
      const res = await api.get(`/adverse-events/study/${activeStudyId}`);
      setAeList(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReportAE = async (e) => {
    e.preventDefault();
    try {
      await api.post('/adverse-events', formData);
      setFormData({ ...formData, aeDescription: '', isSerious: false, seriousCriteria: '' });
      fetchAEs();
    } catch (err) {
      alert(err.response?.data?.message || 'Error reporting AE');
    }
  };

  const handleEscalateSae = async (id) => {
    const criteria = prompt('Enter Serious Criteria (e.g. Hospitalization, Life Threatening):');
    if (!criteria) return;
    try {
      await api.put(`/adverse-events/${id}/sae?seriousCriteria=${encodeURIComponent(criteria)}`);
      fetchAEs();
    } catch (err) {
      alert(err.response?.data?.message || 'Error escalating to SAE');
    }
  };

  const handleSubmitSusar = async (id) => {
    try {
      await api.post(`/adverse-events/${id}/susar`);
      fetchAEs();
      alert('SUSAR safety report transmitted to regulatory authorities.');
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting SUSAR');
    }
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading Adverse Events...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Adverse Event (AE / SAE) Safety Center</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Pharmacovigilance, 24-Hour SAE Escalation, and SUSAR Regulatory Reporting</p>
      </div>

      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        {/* Report Form */}
        <div className="glass-panel">
          <h3 style={{ color: '#ef4444', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={20} /> Report Adverse Event
          </h3>
          <form onSubmit={handleReportAE}>
            <div className="form-group">
              <label>Participant ID</label>
              <input type="number" className="input-control" value={formData.participantId} onChange={(e) => setFormData({ ...formData, participantId: Number(e.target.value) })} required />
            </div>

            <div className="form-group">
              <label>AE Description / Diagnosis</label>
              <textarea className="input-control" rows={2} value={formData.aeDescription} onChange={(e) => setFormData({ ...formData, aeDescription: e.target.value })} placeholder="e.g. Grade 3 Febrile Neutropenia" required />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Severity Grade</label>
                <select className="input-control" value={formData.severity} onChange={(e) => setFormData({ ...formData, severity: e.target.value })}>
                  <option value="MILD">Mild (Grade 1)</option>
                  <option value="MODERATE">Moderate (Grade 2)</option>
                  <option value="SEVERE">Severe (Grade 3)</option>
                  <option value="LIFE_THREATENING">Life-Threatening (Grade 4)</option>
                  <option value="FATAL">Fatal (Grade 5)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Causality (Investigational Product)</label>
                <select className="input-control" value={formData.causality} onChange={(e) => setFormData({ ...formData, causality: e.target.value })}>
                  <option value="UNRELATED">Unrelated</option>
                  <option value="UNLIKELY">Unlikely</option>
                  <option value="POSSIBLE">Possible</option>
                  <option value="PROBABLE">Probable</option>
                  <option value="DEFINITE">Definite</option>
                </select>
              </div>
            </div>

            <div style={{ margin: '1rem 0', padding: '0.75rem', background: '#0f172a', borderRadius: '6px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 700, color: '#f87171' }}>
                <input type="checkbox" checked={formData.isSerious} onChange={(e) => setFormData({ ...formData, isSerious: e.target.checked })} />
                Classify as Serious Adverse Event (SAE) — Starts 24h Clock
              </label>
            </div>

            {formData.isSerious && (
              <div className="form-group">
                <label>SAE Serious Criteria</label>
                <input type="text" className="input-control" value={formData.seriousCriteria} onChange={(e) => setFormData({ ...formData, seriousCriteria: e.target.value })} placeholder="e.g. Hospitalization required" required />
              </div>
            )}

            <button type="submit" className="btn btn-danger" style={{ width: '100%', marginTop: '1rem' }}>
              <ShieldAlert size={18} /> Submit Safety Report
            </button>
          </form>
        </div>

        {/* 24-Hour SAE Countdown Watch */}
        <div className="glass-panel" style={{ borderLeft: '4px solid #ef4444' }}>
          <h3 style={{ color: '#f87171', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={20} /> 24-Hour Regulatory SAE Countdown Watch
          </h3>
          <p style={{ color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '1rem' }}>
            Under ICH E6(R2) & FDA safety guidelines, all SAEs must be submitted to the Sponsor and IRB within 24 hours of site notification.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {aeList.filter(ae => ae.isSerious).map((sae) => (
              <div key={sae.id} style={{ background: '#0f172a', border: '1px solid #ef4444', padding: '0.85rem', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-danger">SAE #{sae.id}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: sae.saeOverdue ? '#ef4444' : '#fbbf24' }}>
                    <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {sae.susarSubmitted ? 'SUSAR SUBMITTED' : sae.saeOverdue ? 'OVERDUE!' : `${sae.hoursRemainingForSaeReport}h REMAINING`}
                  </span>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc', margin: '0.35rem 0' }}>
                  Subject: {sae.subjectId} — {sae.aeDescription}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Reported: {sae.reportedAt}</span>
                  {!sae.susarSubmitted && hasRole(['ADMIN', 'SPONSOR', 'PRINCIPAL_INVESTIGATOR']) && (
                    <button onClick={() => handleSubmitSusar(sae.id)} className="btn btn-primary btn-sm">
                      <Send size={12} /> Submit SUSAR to FDA
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AE Registry Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Subject</th>
              <th>AE Description</th>
              <th>Onset Date</th>
              <th>Severity</th>
              <th>Causality</th>
              <th>Classification</th>
              <th>SUSAR Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {aeList.map((ae) => (
              <tr key={ae.id}>
                <td>{ae.id}</td>
                <td><strong style={{ color: '#38bdf8' }}>{ae.subjectId}</strong></td>
                <td>{ae.aeDescription}</td>
                <td>{ae.onsetDate}</td>
                <td><span className={`badge ${ae.severity === 'MILD' ? 'badge-primary' : 'badge-danger'}`}>{ae.severity}</span></td>
                <td>{ae.causality}</td>
                <td>
                  {ae.isSerious ? (
                    <span className="badge badge-danger">SERIOUS (SAE)</span>
                  ) : (
                    <span className="badge badge-secondary">NON-SERIOUS</span>
                  )}
                </td>
                <td>
                  {ae.susarSubmitted ? (
                    <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={12} /> SUBMITTED
                    </span>
                  ) : (
                    <span className="badge badge-warning">PENDING</span>
                  )}
                </td>
                <td>
                  {!ae.isSerious && hasRole(['ADMIN', 'PRINCIPAL_INVESTIGATOR', 'SUB_INVESTIGATOR']) && (
                    <button onClick={() => handleEscalateSae(ae.id)} className="btn btn-danger btn-sm">
                      Escalate SAE
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AEReporting;
