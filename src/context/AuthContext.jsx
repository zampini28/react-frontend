import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (authToken && storedUsername) {
      api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      setUser({ username: storedUsername });
    }
    setIsLoading(false);
  }, [authToken]);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login/', { username, password });
      const { access } = response.data;
      
      setAuthToken(access);
      localStorage.setItem('authToken', access);
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      localStorage.setItem('username', username);
      setUser({ username: username });
      
      return true;
    } catch (error) {
      console.error("Falha no login", error);
      return false;
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    delete api.defaults.headers.common['Authorization'];
  };

  const authContextValue = {
    authToken,
    user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};
