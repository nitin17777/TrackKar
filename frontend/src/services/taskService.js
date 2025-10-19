import axios from 'axios';
const API_URL = 'http://localhost:5000/api/tasks';

export const addTask = async (teamCode, task) => {
  const res = await axios.post(`${API_URL}/${teamCode}/tasks`, task);
  return res.data;
};

export const updateTask = async (taskId, progress) => {
  const res = await axios.put(`${API_URL}/${taskId}`, { progress });
  return res.data;
};
