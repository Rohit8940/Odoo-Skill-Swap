import React, { useState, useEffect, useContext, createContext } from 'react';
import api from '../services/api'; 

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem('user')) || null
  );


  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete api.defaults.headers.common.Authorization;
      localStorage.removeItem('token');
    }
  }, [token]);

  
  useEffect(() => {
    user
      ? localStorage.setItem('user', JSON.stringify(user))
      : localStorage.removeItem('user');
  }, [user]);

 
  const refreshProfile = async () => {
    const { data } = await api.get('/users/me');
    setUser(data);
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setToken(data.token);
    await refreshProfile(); // load full profile
  };

  const register = async (values) => {
    const { data } = await api.post('/auth/register', values);
    setToken(data.token);
    await refreshProfile();
  };

  const logout = () => {
    setToken('');
    setUser(null);
  };

  const authValue = {
    token,
    user,
    login,
    register,
    logout,
    updateUser: setUser,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
