import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api.jsx';

// Central auth state management
const AuthContext = createContext();

// Manages user authentication state
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Verify login status on app start
  useEffect(() => {
    const checkLoggedIn = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          // Check if token is still valid
          const response = await apiService.getMe();
          if (response.success && response.user) {
            setCurrentUser(response.user);
          } else {
            // Remove invalid token
            localStorage.removeItem('token');
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        localStorage.removeItem('token');
        setCurrentUser(null);
        setError('Authentication failed. Please login again.');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Process user login
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.login(credentials);
      
      if (response.success && response.token) {
        localStorage.setItem('token', response.token);
        setCurrentUser(response.user);
        return { success: true };
      } else if (response.needsUsername) {
        return { needsUsername: true, email: response.email };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to login');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // First-time user setup
  const firstLogin = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.firstLogin(data);
      
      if (response.success && response.token) {
        localStorage.setItem('token', response.token);
        setCurrentUser(response.user);
        return { success: true };
      } else {
        throw new Error(response.message || 'First login failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to complete first login');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign user out
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    navigate('/login');
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    firstLogin,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Simpler way to use auth functions
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;