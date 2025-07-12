import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';          // axios instance baseURL = http://localhost:5000/api

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser]   = useState(
    () => JSON.parse(localStorage.getItem('user')) || null
  );

  // attach token to axios
  useEffect(() => {
    api.defaults.headers.common.Authorization = token ? `Bearer ${token}` : '';
    token
      ? localStorage.setItem('token', token)
      : localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
    user
      ? localStorage.setItem('user', JSON.stringify(user))
      : localStorage.removeItem('user');
  }, [user]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setToken(`Bearer ${data.token}`);
    setUser(data.user);
  };

  const register = async (values) => {
    const { data } = await api.post('/auth/register', values);
    setToken(`Bearer ${data.token}`);
    setUser(data.user);
  };

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
