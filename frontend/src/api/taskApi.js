import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

export const createTask = (task) =>
  api.post('/tasks', task);

export const searchTasks = (params = {}) =>
  api.get('/tasks', { params });

export const assignTask = (id, assignee) =>
  api.patch(`/tasks/${id}/assign`, { assignee });

export const unassignTask = (id) =>
  api.patch(`/tasks/${id}/unassign`);

export const closeTask = (id) =>
  api.patch(`/tasks/${id}/close`);

export const getTaskStats = () =>
  api.get('/tasks/stats');
