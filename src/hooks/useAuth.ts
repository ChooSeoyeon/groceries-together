import { useState } from 'react';
import { api } from '@/lib/api';

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));

  const isAuthenticated = !!token;

  const login = async (email: string, password: string) => {
    const { token } = await api.auth.login(email, password);
    localStorage.setItem('auth_token', token);
    setToken(token);
  };

  const register = async (email: string, password: string) => {
    const { token } = await api.auth.register(email, password);
    localStorage.setItem('auth_token', token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
  };

  return { isAuthenticated, login, register, logout };
}