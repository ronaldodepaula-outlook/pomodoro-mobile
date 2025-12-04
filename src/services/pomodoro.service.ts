import * as SecureStore from 'expo-secure-store';
import api, { setAuthToken } from './api';

async function ensureToken() {
  const token = await SecureStore.getItemAsync('token');
  if (token) setAuthToken(token);
}

export async function startPomodoro(payload?: { tipo?: string; device?: string; task_id?: number }) {
  await ensureToken();
  return api.post('/pomodoros/start', payload || {});
}

export async function finishPomodoro(id: number | string, payload: any) {
  await ensureToken();
  return api.post(`/pomodoros/${id}/finish`, payload);
}

export async function historico(params?: any) {
  await ensureToken();
  return api.get('/pomodoros/historico', { params });
}

export default {
  startPomodoro,
  finishPomodoro,
  historico,
};
