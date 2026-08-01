import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ roles, children }) => {
  const { isAuthenticated, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !hasRole(roles)) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>403 - Access Denied</h2>
        <p style={{ color: '#94a3b8' }}>
          Your role does not have permission to view this GCP trial module.
        </p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
