// Authentication Service
import * as SecureStore from 'expo-secure-store';
import { storageService } from '../storage/storage';
import api, { setAuthToken } from './api';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  nome?: string;
  name?: string;
  email: string;
  password: string;
  password_confirmation?: string;
}

export const authService = {
  register: async (payload: RegisterPayload) => {
    const res = await api.post('/auth/register', payload);
    // do not auto-store token here (handled by caller)
    return res.data;
  },

  login: async (payload: LoginPayload) => {
    const res = await api.post('/auth/login', payload);
    const data = res.data;
    const token = data?.token;
    if (token) {
      await SecureStore.setItemAsync('token', token);
      setAuthToken(token);
    }
    // optionally persist user
    if (data?.user) {
      await storageService.setItem('user', data.user);
    }
    return data;
  },

  logout: async () => {
    const token = await SecureStore.getItemAsync('token');
    try {
      if (token) {
        setAuthToken(token);
        await api.post('/auth/logout');
      }
    } finally {
      await SecureStore.deleteItemAsync('token');
      setAuthToken(null);
      await storageService.removeItem('user');
    }
  },

  getCurrentUser: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};
