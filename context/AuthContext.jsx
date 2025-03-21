
"use client";
import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = Cookies.get('token');
      
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`);
          setUser(res.data);
        } catch (error) {
          Cookies.remove('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      
      setLoading(false);
    };

    loadUser();
  }, []);

  const register = async (name, username, email, password) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      name,
      username,
      email,
      password
    });

    if (res.data.token) {
      Cookies.set('token', res.data.token, { expires: 7 });
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
    }

    return res.data;
  };

  const login = async (email, password) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      email,
      password
    });

    if (res.data.token) {
      Cookies.set('token', res.data.token, { expires: 7 });
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
    }

    return res.data;
  };

  const logout = () => {
    Cookies.remove('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateProfile = async (userData) => {
    const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, userData);
    setUser(res.data);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
