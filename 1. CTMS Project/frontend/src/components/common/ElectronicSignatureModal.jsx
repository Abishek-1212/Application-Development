import React, { useState } from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

const ElectronicSignatureModal = ({ isOpen, onClose, onConfirm, actionTitle }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password || !reason) return;
    const sigHash = `SIG-${username}-${Date.now().toString(36)}`;
    onConfirm({ username, password, reason, sigHash });
    setUsername('');
    setPassword('');
    setReason('');
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', marginBottom: '0.5rem' }}>
          <ShieldCheck size={24} /> 21 CFR Part 11 Electronic Signature
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          Action: <strong>{actionTitle}</strong>. Per FDA 21 CFR Part 11 and ICH GCP guidelines, please re-authenticate with your password to electronically sign this record.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username / Email</label>
            <input
              type="text"
              className="input-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Confirm username"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="input-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <div className="form-group">
            <label>Reason for Sign-off</label>
            <textarea
              className="input-control"
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for signing e.g. Data verification complete"
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">
              <Lock size={16} /> Sign & Execute
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ElectronicSignatureModal;
