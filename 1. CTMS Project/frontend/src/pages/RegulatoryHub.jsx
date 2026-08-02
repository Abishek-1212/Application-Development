import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FileText, Upload, CheckCircle, Clock, AlertTriangle, Folder } from 'lucide-react';

const RegulatoryHub = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { activeStudyId, hasRole } = useAuth();

  const [formData, setFormData] = useState({
    studyId: activeStudyId,
    documentType: 'INVESTIGATOR_BROCHURE',
    documentTitle: '',
    version: 'v1.0',
    effectiveDate: new Date().toISOString().split('T')[0],
    submittedTo: 'Central IRB',
    submissionDate: new Date().toISOString().split('T')[0],
    approvalStatus: 'SUBMITTED',
  });

  useEffect(() => {
    fetchDocs();
  }, [activeStudyId]);

  const fetchDocs = async () => {
    try {
      const res = await api.get(`/documents/${activeStudyId}`);
      setDocs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      await api.post('/documents', formData);
      setFormData({ ...formData, documentTitle: '' });
      fetchDocs();
      alert('Document uploaded to Trial Master File (TMF).');
    } catch (err) {
      alert(err.response?.data?.message || 'Error uploading document');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/documents/${id}/status?status=${status}`);
      fetchDocs();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading Regulatory Documents...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Regulatory Hub & Trial Master File (TMF)</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>ICH E6(R2) Reference Model Tree, Versioning, and IRB/IEC Approvals</p>
      </div>

      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        {/* Upload Form */}
        <div className="glass-panel">
          <h3 style={{ color: '#38bdf8', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Upload size={18} /> Upload TMF Master Document
          </h3>
          <form onSubmit={handleUpload}>
            <div className="form-group">
              <label>Document Title</label>
              <input type="text" className="input-control" value={formData.documentTitle} onChange={(e) => setFormData({ ...formData, documentTitle: e.target.value })} placeholder="e.g. Master Clinical Protocol Amendment 2" required />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Document Type (ICH E6 Zone)</label>
                <select className="input-control" value={formData.documentType} onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}>
                  <option value="INVESTIGATOR_BROCHURE">Investigator Brochure (Zone 1)</option>
                  <option value="PROTOCOL">Master Protocol (Zone 2)</option>
                  <option value="IRB_APPROVAL">IRB / IEC Approval (Zone 3)</option>
                  <option value="ICF_TEMPLATE">Informed Consent Template (Zone 4)</option>
                  <option value="CTA_AGREEMENT">Clinical Trial Agreement (Zone 5)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Version</label>
                <input type="text" className="input-control" value={formData.version} onChange={(e) => setFormData({ ...formData, version: e.target.value })} required />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Submitted To</label>
                <input type="text" className="input-control" value={formData.submittedTo} onChange={(e) => setFormData({ ...formData, submittedTo: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Submission Date</label>
                <input type="date" className="input-control" value={formData.submissionDate} onChange={(e) => setFormData({ ...formData, submissionDate: e.target.value })} required />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Upload to TMF
            </button>
          </form>
        </div>

        {/* TMF Folder Structure Tree View */}
        <div className="glass-panel">
          <h3 style={{ color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Folder size={18} color="#f59e0b" /> ICH E6(R2) TMF Folder Structure
          </h3>
          <div style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ background: '#0f172a', padding: '0.6rem', borderRadius: '6px' }}>📁 Zone 1: Trial Management & IB</div>
            <div style={{ background: '#0f172a', padding: '0.6rem', borderRadius: '6px' }}>📁 Zone 2: Central Protocol & Amendments</div>
            <div style={{ background: '#0f172a', padding: '0.6rem', borderRadius: '6px' }}>📁 Zone 3: IRB / Ethics Committee Approvals</div>
            <div style={{ background: '#0f172a', padding: '0.6rem', borderRadius: '6px' }}>📁 Zone 4: Informed Consent Documents</div>
            <div style={{ background: '#0f172a', padding: '0.6rem', borderRadius: '6px' }}>📁 Zone 5: Investigator Qualification (CV / GCP Certs)</div>
          </div>
        </div>
      </div>

      {/* TMF Documents Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Document Title</th>
              <th>Type</th>
              <th>Version</th>
              <th>Submitted To</th>
              <th>Submission Date</th>
              <th>Approval Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((d) => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td><strong style={{ color: '#f8fafc' }}>{d.documentTitle}</strong></td>
                <td><span className="badge badge-primary">{d.documentType}</span></td>
                <td>{d.version}</td>
                <td>{d.submittedTo}</td>
                <td>{d.submissionDate}</td>
                <td>
                  <span className={`badge ${d.approvalStatus === 'APPROVED' ? 'badge-success' : 'badge-warning'}`}>
                    {d.approvalStatus}
                  </span>
                </td>
                <td>
                  {d.approvalStatus !== 'APPROVED' && hasRole(['ADMIN', 'REGULATORY_AFFAIRS', 'PRINCIPAL_INVESTIGATOR']) && (
                    <button onClick={() => handleUpdateStatus(d.id, 'APPROVED')} className="btn btn-primary btn-sm">
                      Approve
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

export default RegulatoryHub;
