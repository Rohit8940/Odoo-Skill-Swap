// src/context/AuthProvider.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  /* ────────── state ────────── */
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('user');
    return cached ? JSON.parse(cached) : null;
  });

  /* ────────── side‑effects ────────── */
  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  /* ────────── actions ────────── */
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setToken(data.token);
    setUser(data.user); // backend must return { token, user }
  };

  const register = async (values) => {
    const { data } = await api.post('/auth/register', values);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    setToken('');
    setUser(null);
  };

  /* ────────── context value ────────── */
  const authValue = { token, user, login, register, logout };

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
