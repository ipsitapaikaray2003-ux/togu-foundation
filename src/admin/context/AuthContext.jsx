import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('togu_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('togu_admin_token') || null);
  const [loading, setLoading] = useState(true);

  // Verify session on mount with /api/auth/me
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const storedToken = localStorage.getItem('togu_admin_token');
      if (!storedToken) {
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const res = await authApi.getMe();
        if (isMounted && res.success && res.user) {
          setUser(res.user);
          localStorage.setItem('togu_admin_user', JSON.stringify(res.user));
        }
      } catch (err) {
        console.warn('Session verification failed, logging out:', err.message);
        if (isMounted) {
          setUser(null);
          setToken(null);
          localStorage.removeItem('togu_admin_token');
          localStorage.removeItem('togu_admin_user');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkAuth();

    // Listen for 401 expiration event
    const handleExpired = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener('togu_auth_expired', handleExpired);

    return () => {
      isMounted = false;
      window.removeEventListener('togu_auth_expired', handleExpired);
    };
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    if (res.success && res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('togu_admin_token', res.token);
      localStorage.setItem('togu_admin_user', JSON.stringify(res.user));
      return res.user;
    }
    throw new Error(res.message || 'Login failed');
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore network errors on logout
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('togu_admin_token');
      localStorage.removeItem('togu_admin_user');
    }
  };

  const hasRole = (...roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    loading,
    login,
    logout,
    hasRole,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
