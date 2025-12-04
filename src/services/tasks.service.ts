import * as SecureStore from 'expo-secure-store';
import api, { setAuthToken } from './api';

async function ensureToken() {
  const token = await SecureStore.getItemAsync('token');
  if (token) setAuthToken(token);
}

export async function listTasks(params?: any) {
  await ensureToken();
  return api.get('/tasks', { params });
}

export async function createTask(payload: any) {
  await ensureToken();
  return api.post('/tasks', payload);
}

export async function showTask(id: number | string) {
  await ensureToken();
  return api.get(`/tasks/${id}`);
}

export async function updateTask(id: number | string, payload: any) {
  await ensureToken();
  return api.put(`/tasks/${id}`, payload);
}

export async function deleteTask(id: number | string) {
  await ensureToken();
  return api.delete(`/tasks/${id}`);
}

export default {
  listTasks,
  createTask,
  showTask,
  updateTask,
  deleteTask,
};
