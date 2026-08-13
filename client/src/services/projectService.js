import API from './api';

export const getProjects = async () => {
  const res = await API.get('/projects');
  return res.data;
};

export const createProject = async (projectData) => {
  const res = await API.post('/projects', projectData);
  return res.data;
};