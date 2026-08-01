import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Package, Plus, Minus, AlertCircle, CheckCircle } from 'lucide-react';

const IPAccountability = () => {
  const [ipList, setIpList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { activeStudyId, hasRole } = useAuth();

  // Receipt Form State
  const [receipt, setReceipt] = useState({
    studyId: activeStudyId,
    siteId: 1,
    batchNumber: 'BATCH-2026-X1',
    kitNumber: 'KIT-2001',
    quantityReceived: 50,
    expiryDate: '2027-12-31',
  });

  // Dispense Form State
  const [dispense, setDispense] = useState({
    ipRecordId: 1,
    quantity: 1,
  });

  useEffect(() => {
    fetchIp();
  }, [activeStudyId]);

  const fetchIp = async () => {
    try {
      const res = await api.get(`/ip/accountability/${activeStudyId}`);
      setIpList(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordReceipt = async (e) => {
    e.preventDefault();
    try {
      await api.post('/ip/receipt', receipt);
      fetchIp();
      alert('IP shipment receipt logged successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Error recording receipt');
    }
  };

  const handleDispense = async (e) => {
    e.preventDefault();
    try {
      await api.post('/ip/dispense', dispense);
      fetchIp();
      alert('IP dispensing logged. Running balance updated.');
    } catch (err) {
      alert(err.response?.data?.message || 'Dispensing rejected! Insufficient balance.');
    }
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading IP Inventory...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Investigational Product (IP) Accountability</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Kit Inventory, Dispensing Balance Math, and Reconciliation</p>
      </div>

      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        {/* Receipt Panel */}
        <div className="glass-panel">
          <h3 style={{ color: '#38bdf8', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Package size={18} /> Record IP Shipment Receipt
          </h3>
          <form onSubmit={handleRecordReceipt}>
            <div className="grid-2">
              <div className="form-group">
                <label>Batch Number</label>
                <input type="text" className="input-control" value={receipt.batchNumber} onChange={(e) => setReceipt({ ...receipt, batchNumber: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Kit Number</label>
                <input type="text" className="input-control" value={receipt.kitNumber} onChange={(e) => setReceipt({ ...receipt, kitNumber: e.target.value })} required />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Quantity Received</label>
                <input type="number" className="input-control" value={receipt.quantityReceived} onChange={(e) => setReceipt({ ...receipt, quantityReceived: Number(e.target.value) })} required min={1} />
              </div>
              <div className="form-group">
                <label>Expiry Date</label>
                <input type="date" className="input-control" value={receipt.expiryDate} onChange={(e) => setReceipt({ ...receipt, expiryDate: e.target.value })} required />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              <Plus size={16} /> Log IP Receipt
            </button>
          </form>
        </div>

        {/* Dispense Panel */}
        <div className="glass-panel">
          <h3 style={{ color: '#10b981', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Minus size={18} /> Dispense IP to Subject
          </h3>
          <form onSubmit={handleDispense}>
            <div className="form-group">
              <label>Select IP Kit/Batch ID</label>
              <select className="input-control" value={dispense.ipRecordId} onChange={(e) => setDispense({ ...dispense, ipRecordId: Number(e.target.value) })}>
                {ipList.map((item) => (
                  <option key={item.id} value={item.id}>
                    Batch {item.batchNumber} (Kit {item.kitNumber}) — Balance: {item.currentBalance}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Quantity Dispensed</label>
                <input type="number" className="input-control" value={dispense.quantity} onChange={(e) => setDispense({ ...dispense, quantity: Number(e.target.value) })} required min={1} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Dispense IP Kit
            </button>
          </form>
        </div>
      </div>

      {/* Running Balance Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Batch No.</th>
              <th>Kit No.</th>
              <th>Received</th>
              <th>Dispensed</th>
              <th>Returned</th>
              <th>Destroyed</th>
              <th>Current Balance</th>
              <th>Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {ipList.map((ip) => (
              <tr key={ip.id}>
                <td>{ip.id}</td>
                <td><strong style={{ color: '#f8fafc' }}>{ip.batchNumber}</strong></td>
                <td>{ip.kitNumber}</td>
                <td>{ip.quantityReceived}</td>
                <td>{ip.quantityDispensed}</td>
                <td>{ip.quantityReturned}</td>
                <td>{ip.quantityDestroyed}</td>
                <td>
                  <strong style={{ color: ip.currentBalance < 10 ? '#ef4444' : '#10b981', fontSize: '1.1rem' }}>
                    {ip.currentBalance}
                  </strong>
                </td>
                <td>{ip.expiryDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IPAccountability;
