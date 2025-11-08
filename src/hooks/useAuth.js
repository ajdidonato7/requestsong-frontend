import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedArtist = localStorage.getItem('artist');

      if (storedToken && storedArtist) {
        try {
          // Verify token is still valid
          const response = await authAPI.getCurrentUser();
          setArtist(response.data);
          setToken(storedToken);
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('artist');
          setToken(null);
          setArtist(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await authAPI.login(formData);
      const { access_token } = response.data;

      // Get user profile
      localStorage.setItem('token', access_token);
      const userResponse = await authAPI.getCurrentUser();
      const artistData = userResponse.data;

      setToken(access_token);
      setArtist(artistData);
      localStorage.setItem('artist', JSON.stringify(artistData));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('artist');
    setToken(null);
    setArtist(null);
  };

  const isAuthenticated = () => {
    return !!token && !!artist;
  };

  const value = {
    artist,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};