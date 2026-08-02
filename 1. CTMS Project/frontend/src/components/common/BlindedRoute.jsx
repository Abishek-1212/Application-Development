import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Lock, Unlock } from 'lucide-react';

const BlindedRoute = ({ children, onUnblindConfirm }) => {
  const { user } = useAuth();
  const [isUnblinded, setIsUnblinded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState('');

  const isEligibleForUnblinding = ['PRINCIPAL_INVESTIGATOR', 'SUB_INVESTIGATOR', 'SPONSOR', 'ADMIN'].includes(user?.role);

  const handleConfirm = () => {
    if (!reason.trim()) return;
    setIsUnblinded(true);
    setShowModal(false);
    if (onUnblindConfirm) onUnblindConfirm(reason);
  };

  if (!isEligibleForUnblinding) {
    return (
      <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#f87171' }}>
        <ShieldAlert size={20} style={{ display: 'inline', marginRight: '6px' }} />
        Treatment Arm & Randomization Data is strictly <strong>BLINDED</strong> for your role under study protocol guidelines.
      </div>
    );
  }

  if (!isUnblinded) {
    return (
      <div style={{ padding: '1rem', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <Lock size={18} style={{ display: 'inline', marginRight: '6px' }} />
          <span>Treatment assignment is currently masked (Double-Blind Protocol).</span>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-warning btn-sm">
          <Unlock size={14} /> Request Emergency Unblinding
        </button>

        {showModal && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <h3 style={{ color: '#ef4444', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert /> Emergency Unblinding Warning
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Unblinding a participant requires medical justification. This action is permanently hash-chained in the GCP audit log.
              </p>
              <div className="form-group">
                <label>Medical Rationale / Justification:</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter medical reason for emergency unblinding..."
                  className="input-control"
                  rows={3}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '1rem' }}>
                <button onClick={() => setShowModal(false)} className="btn btn-secondary btn-sm">Cancel</button>
                <button onClick={handleConfirm} disabled={!reason.trim()} className="btn btn-danger btn-sm">Confirm Unblind</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return children;
};

export default BlindedRoute;
