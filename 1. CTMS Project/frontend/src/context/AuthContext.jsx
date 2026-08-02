import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ctms_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('ctms_jwt_token') || null;
  });

  const [activeStudyId, setActiveStudyId] = useState(1);

  const login = (authResponse) => {
    const userData = {
      userId: authResponse.userId,
      username: authResponse.username,
      email: authResponse.email,
      role: authResponse.role,
      gcpCertNumber: authResponse.gcpCertNumber,
      gcpExpiryDate: authResponse.gcpExpiryDate,
    };
    setUser(userData);
    setToken(authResponse.token);
    localStorage.setItem('ctms_user', JSON.stringify(userData));
    localStorage.setItem('ctms_jwt_token', authResponse.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ctms_user');
    localStorage.removeItem('ctms_jwt_token');
  };

  const hasRole = (allowedRoles) => {
    if (!user) return false;
    if (user.role === 'ADMIN') return true; // Admin bypass per permission matrix
    if (Array.isArray(allowedRoles)) {
      return allowedRoles.includes(user.role);
    }
    return allowedRoles === user.role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        activeStudyId,
        setActiveStudyId,
        login,
        logout,
        hasRole,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
