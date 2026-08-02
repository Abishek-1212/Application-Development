import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import NavBar from './components/common/NavBar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Studies from './pages/Studies';
import StudySetup from './pages/StudySetup';
import Participants from './pages/Participants';
import eCRFEntry from './pages/eCRFEntry';
import AEReporting from './pages/AEReporting';
import IPAccountability from './pages/IPAccountability';
import RegulatoryHub from './pages/RegulatoryHub';
import Reports from './pages/Reports';
import AdminPanel from './pages/AdminPanel';
import ParticipantPortal from './pages/ParticipantPortal';

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar />
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />

          {/* All authenticated roles */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/reports" element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          } />

          {/* Studies */}
          <Route path="/studies" element={
            <ProtectedRoute roles={['ADMIN', 'SPONSOR', 'PRINCIPAL_INVESTIGATOR', 'SUB_INVESTIGATOR', 'SITE_COORDINATOR', 'DATA_MANAGER', 'REGULATORY_AFFAIRS']}>
              <Studies />
            </ProtectedRoute>
          } />

          <Route path="/studies/new" element={
            <ProtectedRoute roles={['ADMIN', 'SPONSOR']}>
              <StudySetup />
            </ProtectedRoute>
          } />

          {/* Participants */}
          <Route path="/participants" element={
            <ProtectedRoute roles={['ADMIN', 'SITE_COORDINATOR', 'SUB_INVESTIGATOR', 'PRINCIPAL_INVESTIGATOR', 'DATA_MANAGER']}>
              <Participants />
            </ProtectedRoute>
          } />

          {/* eCRF */}
          <Route path="/ecrf/:participantId/:visitId" element={
            <ProtectedRoute roles={['ADMIN', 'SUB_INVESTIGATOR', 'SITE_COORDINATOR', 'DATA_MANAGER', 'PRINCIPAL_INVESTIGATOR', 'PARTICIPANT']}>
              <eCRFEntry />
            </ProtectedRoute>
          } />

          {/* Adverse Events */}
          <Route path="/adverse-events" element={
            <ProtectedRoute roles={['ADMIN', 'PRINCIPAL_INVESTIGATOR', 'SUB_INVESTIGATOR', 'SITE_COORDINATOR', 'SPONSOR', 'DATA_MANAGER']}>
              <AEReporting />
            </ProtectedRoute>
          } />

          {/* IP Accountability */}
          <Route path="/ip-accountability" element={
            <ProtectedRoute roles={['ADMIN', 'SITE_COORDINATOR', 'SUB_INVESTIGATOR', 'PRINCIPAL_INVESTIGATOR', 'SPONSOR']}>
              <IPAccountability />
            </ProtectedRoute>
          } />

          {/* Regulatory */}
          <Route path="/regulatory" element={
            <ProtectedRoute roles={['ADMIN', 'REGULATORY_AFFAIRS', 'PRINCIPAL_INVESTIGATOR', 'SITE_COORDINATOR', 'SPONSOR']}>
              <RegulatoryHub />
            </ProtectedRoute>
          } />

          {/* Admin only */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminPanel />
            </ProtectedRoute>
          } />

          {/* Participant portal */}
          <Route path="/participant-portal" element={
            <ProtectedRoute roles={['PARTICIPANT', 'ADMIN']}>
              <ParticipantPortal />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
