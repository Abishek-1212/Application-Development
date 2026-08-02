import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import { BarChart2, PieChart as PieIcon, TrendingUp, ShieldCheck } from 'lucide-react';

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/admin/analytics');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading Analytics & Reports...</div>;

  const COLORS = ['#0284c7', '#f59e0b', '#ef4444', '#10b981'];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Clinical Trial Analytics & Portfolio Reports</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Real-time Visualization of Enrollment, Safety Signal Distribution, and Protocol Compliance</p>
      </div>

      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        {/* Site Enrollment Chart */}
        <div className="glass-panel">
          <h3 style={{ color: '#38bdf8', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={18} /> Site-Level Enrollment vs Target
          </h3>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={data?.siteEnrollmentStats || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="siteName" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155' }} />
                <Bar dataKey="actualEnrollment" name="Actual Enrolled" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="targetEnrollment" name="Target Target" fill="#334155" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AE Severity Pie Chart */}
        <div className="glass-panel">
          <h3 style={{ color: '#ef4444', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PieIcon size={18} /> Safety Signals — Adverse Event Severity Grade
          </h3>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data?.aeSeverityStats || []} dataKey="count" nameKey="severity" cx="50%" cy="50%" outerRadius={90} label>
                  {(data?.aeSeverityStats || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Enrollment Line Chart */}
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#10b981', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <BarChart2 size={18} /> Cumulative Monthly Enrollment Accrual Trend
        </h3>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <LineChart data={data?.enrollmentTrends || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155' }} />
              <Line type="monotone" dataKey="count" name="Subjects" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;
