import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getUserFromToken());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // validate token with server on mount
    async function validate() {
      const token = authService.getToken();
      if (!token) return;
      setLoading(true);
      try {
        const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Invalid token');
        const data = await res.json();
        setUser(data.user || authService.getUserFromToken());
      } catch (err) {
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    validate();
  }, []);

  async function login(username, password) {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(username, password);
      const u = authService.getUserFromToken();
      setUser(u);
      return data;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function register(payload) {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.register(payload);
      // auto-login
      await authService.login(payload.username, payload.password);
      setUser(authService.getUserFromToken());
      return data;
    } catch (err) {
      setError(err.message || 'Register failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    authService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
