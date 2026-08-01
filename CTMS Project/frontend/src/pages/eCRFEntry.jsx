import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ElectronicSignatureModal from '../components/common/ElectronicSignatureModal';
import { FileText, AlertTriangle, ShieldCheck, Edit3, Lock } from 'lucide-react';

const eCRFEntry = () => {
  const { participantId, visitId } = useParams();
  const [ecrfList, setEcrfList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeForm, setActiveForm] = useState('VITAL');

  // Form field state
  const [fieldId, setFieldId] = useState('sys_bp');
  const [fieldValue, setFieldValue] = useState('');
  const [deviationAlert, setDeviationAlert] = useState(null);

  // Modification modal state
  const [modifyingItem, setModifyingItem] = useState(null);
  const [modValue, setModValue] = useState('');
  const [modReason, setModReason] = useState('');

  // E-sig modal
  const [sigModalAction, setSigModalAction] = useState(null);
  const [pendingPayload, setPendingPayload] = useState(null);

  useEffect(() => {
    fetchEcrf();
  }, [participantId, visitId]);

  const fetchEcrf = async () => {
    try {
      const res = await api.get(`/ecrf/${participantId}/${visitId}`);
      setEcrfList(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInit = (e) => {
    e.preventDefault();
    setPendingPayload({ participantId: Number(participantId), visitId: Number(visitId), formId: activeForm, fieldId, fieldValue });
    setSigModalAction('SAVE_ECRF');
  };

  const handleModifyInit = (item) => {
    setModifyingItem(item);
    setModValue(item.fieldValue);
    setModReason('');
  };

  const handleModifyConfirmSig = () => {
    if (!modReason.trim()) {
      alert('Modification reason is MANDATORY under GCP guidelines.');
      return;
    }
    setPendingPayload({ id: modifyingItem.id, fieldValue: modValue, modificationReason: modReason });
    setSigModalAction('MODIFY_ECRF');
  };

  const executeSigSubmit = async (sigData) => {
    try {
      if (sigModalAction === 'SAVE_ECRF') {
        const payload = { ...pendingPayload, electronicSignature: sigData.sigHash };
        const res = await api.post('/ecrf/data', payload);
        if (res.data.protocolDeviationTriggered) {
          setDeviationAlert(res.data.deviationMessage);
        } else {
          setDeviationAlert(null);
        }
        setFieldValue('');
      } else if (sigModalAction === 'MODIFY_ECRF') {
        const payload = { ...pendingPayload, electronicSignature: sigData.sigHash };
        await api.put(`/ecrf/data/${pendingPayload.id}`, payload);
        setModifyingItem(null);
      }
      fetchEcrf();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setSigModalAction(null);
    }
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading eCRF Form...</div>;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Electronic Case Report Form (eCRF)</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Participant ID: <span style={{ color: '#38bdf8' }}>#{participantId}</span> | Visit: <span className="badge badge-primary">Visit 1 - Screening</span>
          </p>
        </div>
      </div>

      {/* Deviation Warning Alert */}
      {deviationAlert && (
        <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.5)', color: '#f87171', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertTriangle size={24} />
          <div>
            <strong>PROTOCOL DEVIATION AUTO-FLAGGED:</strong> {deviationAlert}
          </div>
        </div>
      )}

      {/* eCRF Form Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['VITAL', 'DEMOG', 'LABS', 'CONMED'].map((form) => (
          <button
            key={form}
            onClick={() => setActiveForm(form)}
            className={`btn ${activeForm === form ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '9999px' }}
          >
            {form} Form
          </button>
        ))}
      </div>

      <div className="grid-2">
        {/* Entry Panel */}
        <div className="glass-panel">
          <h3 style={{ color: '#38bdf8', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileText size={18} /> Enter New {activeForm} Data
          </h3>

          <form onSubmit={handleSaveInit}>
            <div className="form-group">
              <label>Select Field ID</label>
              <select className="input-control" value={fieldId} onChange={(e) => setFieldId(e.target.value)}>
                {activeForm === 'VITAL' && (
                  <>
                    <option value="sys_bp">Systolic BP (mmHg) [Normal: 90-140]</option>
                    <option value="dia_bp">Diastolic BP (mmHg) [Normal: 60-90]</option>
                    <option value="heart_rate">Heart Rate (bpm) [Normal: 50-100]</option>
                  </>
                )}
                {activeForm === 'DEMOG' && (
                  <>
                    <option value="age">Age (Years)</option>
                    <option value="gender">Gender</option>
                    <option value="ethnicity">Ethnicity</option>
                  </>
                )}
                {activeForm === 'LABS' && (
                  <>
                    <option value="alt_liver">ALT Liver Enzyme (U/L) [ULN: 40]</option>
                    <option value="glucose_fasting">Fasting Glucose (mg/dL)</option>
                  </>
                )}
              </select>
            </div>

            <div className="form-group">
              <label>Field Value</label>
              <input
                type="text"
                className="input-control"
                value={fieldValue}
                onChange={(e) => setFieldValue(e.target.value)}
                placeholder="Enter value e.g. 120"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              <ShieldCheck size={18} /> Electronically Sign & Save Field
            </button>
          </form>
        </div>

        {/* Audit Trail & History Panel */}
        <div className="glass-panel">
          <h3 style={{ color: '#f8fafc', marginBottom: '1rem' }}>Saved eCRF Fields & GCP Audit Trail</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {ecrfList.map((item) => (
              <div key={item.id} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: '#38bdf8', fontSize: '0.9rem' }}>{item.fieldId}</strong>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Entered by: {item.enteredByName}</span>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', margin: '0.25rem 0' }}>
                  {item.fieldValue}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Sig: {item.electronicSignature.substring(0, 16)}...</span>
                  <button onClick={() => handleModifyInit(item)} className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}>
                    <Edit3 size={12} /> Modify (GCP Reason Req)
                  </button>
                </div>

                {item.modificationReason && (
                  <div style={{ marginTop: '0.5rem', padding: '0.4rem', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '4px', fontSize: '0.75rem', color: '#fbbf24' }}>
                    <strong>GCP Mod Reason:</strong> {item.modificationReason} (Modified by {item.modifiedByName})
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modify Reason Modal */}
      {modifyingItem && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Modify eCRF Field: {modifyingItem.fieldId}</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>
              ICH GCP compliance requires a documented audit reason for editing saved clinical data.
            </p>
            <div className="form-group">
              <label>New Value</label>
              <input type="text" className="input-control" value={modValue} onChange={(e) => setModValue(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Mandatory Modification Reason</label>
              <textarea className="input-control" rows={3} value={modReason} onChange={(e) => setModReason(e.target.value)} placeholder="e.g. Transcription error correction from original lab slip" required />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '1rem' }}>
              <button onClick={() => setModifyingItem(null)} className="btn btn-secondary btn-sm">Cancel</button>
              <button onClick={handleModifyConfirmSig} disabled={!modReason.trim()} className="btn btn-primary btn-sm">Proceed to e-Signature</button>
            </div>
          </div>
        </div>
      )}

      {/* E-Sig Popup */}
      <ElectronicSignatureModal
        isOpen={!!sigModalAction}
        onClose={() => setSigModalAction(null)}
        onConfirm={executeSigSubmit}
        actionTitle={sigModalAction === 'SAVE_ECRF' ? 'eCRF Field Save' : 'eCRF Modification'}
      />
    </div>
  );
};

export default eCRFEntry;
