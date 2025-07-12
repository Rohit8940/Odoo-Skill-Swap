import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';  // Axios instance with baseURL

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);

  // Set default Authorization header in axios on token change
  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete api.defaults.headers.common.Authorization;
      localStorage.removeItem('token');
    }
  }, [token]);

  // Store user in localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Login
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setToken(data.token);          // ✅ no "Bearer " prefix here
    setUser(data.user);
  };

  // Register
  const register = async (values) => {
    const { data } = await api.post('/auth/register', values);
    setToken(data.token);          // ✅ no "Bearer " prefix here
    setUser(data.user);
  };

  // Logout
  const logout = () => {
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
