import API from './api';

export const getTasks = async (projectId, filters = {}) => {
  const params = new URLSearchParams({ project: projectId, ...filters });
  const res = await API.get(`/tasks?${params}`);
  return res.data;
};

export const createTask = async (taskData) => {
  const res = await API.post('/tasks', taskData);
  return res.data;
};

export const updateTask = async (taskId, updates) => {
  const res = await API.put(`/tasks/${taskId}`, updates);
  return res.data;
};

export const deleteTask = async (taskId) => {
  const res = await API.delete(`/tasks/${taskId}`);
  return res.data;
};