import API from './api';

export const getComments = async (taskId) => {
  const res = await API.get(`/comments/${taskId}`);
  return res.data;
};

export const addComment = async (taskId, text) => {
  const res = await API.post('/comments', { taskId, text });
  return res.data;
};

export const deleteComment = async (commentId) => {
  const res = await API.delete(`/comments/${commentId}`);
  return res.data;
};