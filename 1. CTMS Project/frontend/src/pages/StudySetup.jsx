import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PlusCircle } from 'lucide-react';

const StudySetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studyTitle: '',
    sponsorId: user?.userId || 1,
    phase: 'PHASE_3',
    therapeuticArea: 'Oncology',
    protocolVersion: 'v1.0',
    targetEnrollment: 100,
    irbApprovalDate: '',
    regulatoryApprovalDate: '',
    primaryEndpoint: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/studies', formData);
      navigate('/studies');
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating study');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '3rem auto', padding: '0 1rem' }}>
      <div className="glass-panel">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Protocol Setup & Trial Initialization</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Study / Protocol Title</label>
            <input type="text" className="input-control" value={formData.studyTitle} onChange={(e) => setFormData({ ...formData, studyTitle: e.target.value })} placeholder="e.g. Phase III Randomized Trial in Breast Cancer" required />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Study Phase</label>
              <select className="input-control" value={formData.phase} onChange={(e) => setFormData({ ...formData, phase: e.target.value })}>
                <option value="PHASE_1">Phase I</option>
                <option value="PHASE_2">Phase II</option>
                <option value="PHASE_3">Phase III</option>
                <option value="PHASE_4">Phase IV</option>
                <option value="OBSERVATIONAL">Observational</option>
              </select>
            </div>

            <div className="form-group">
              <label>Therapeutic Area</label>
              <input type="text" className="input-control" value={formData.therapeuticArea} onChange={(e) => setFormData({ ...formData, therapeuticArea: e.target.value })} required />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Protocol Version</label>
              <input type="text" className="input-control" value={formData.protocolVersion} onChange={(e) => setFormData({ ...formData, protocolVersion: e.target.value })} required />
            </div>

            <div className="form-group">
              <label>Target Enrollment (Subjects)</label>
              <input type="number" className="input-control" value={formData.targetEnrollment} onChange={(e) => setFormData({ ...formData, targetEnrollment: Number(e.target.value) })} required />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>IRB Approval Date</label>
              <input type="date" className="input-control" value={formData.irbApprovalDate} onChange={(e) => setFormData({ ...formData, irbApprovalDate: e.target.value })} />
            </div>

            <div className="form-group">
              <label>Regulatory Approval Date</label>
              <input type="date" className="input-control" value={formData.regulatoryApprovalDate} onChange={(e) => setFormData({ ...formData, regulatoryApprovalDate: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label>Primary Outcome Endpoint</label>
            <textarea className="input-control" rows={2} value={formData.primaryEndpoint} onChange={(e) => setFormData({ ...formData, primaryEndpoint: e.target.value })} placeholder="e.g. Overall Survival at 12 Months" />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            {loading ? 'Creating...' : <><PlusCircle size={18} /> Initialize Study Protocol</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudySetup;
