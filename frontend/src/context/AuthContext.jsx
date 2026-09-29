import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Verify session using HttpOnly cookie automatically sent by browser
        const res = await authAPI.getMe();
        if (res.data.success && res.data.user) {
          setUser(res.data.user);
          setToken('cookie-session');
        } else {
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      if (res.data.success) {
        const { user } = res.data;
        setUser(user);
        setToken('cookie-session');
        // Do not store long-lived tokens in localStorage (HttpOnly cookie manages session)
        localStorage.removeItem('careerpilot_token');
        return { success: true, user };
      }
      return { success: false, message: res.data.message || 'Login failed' };
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Invalid credentials';
      return { success: false, message: msg };
    }
  };

  const register = async (userData) => {
    try {
      const res = await authAPI.register(userData);
      if (res.data.success) {
        const { user } = res.data;
        setUser(user);
        setToken('cookie-session');
        localStorage.removeItem('careerpilot_token');
        return { success: true, user };
      }
      return { success: false, message: res.data.message || 'Registration failed' };
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Registration failed';
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (e) {
      // Continue cleanup anyway
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('careerpilot_token');
    localStorage.removeItem('careerpilot_user');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const refreshUser = async () => {
    try {
      const res = await authAPI.getMe();
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        setToken('cookie-session');
      }
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
