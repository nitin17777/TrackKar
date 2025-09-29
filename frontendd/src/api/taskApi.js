import axios from "axios";
import { BASE_URL } from "./config"; // import backend URL

export const fetchTasks = async (teamId) => {
  const response = await axios.get(`${BASE_URL}/tasks/${teamId}`);
  return response.data;
};

export const createTeam = async (teamName) => {
  const response = await axios.post(`${BASE_URL}/createTeam`, { teamName });
  return response.data;
};

export const joinTeam = async (teamCode, username) => {
  const response = await axios.post(`${BASE_URL}/joinTeam`, { teamCode, username });
  return response.data;
};

export const createTask = async (task) => {
  const response = await axios.post(`${BASE_URL}/tasks`, task);
  return response.data;
};

export const updateTask = async (taskId, data) => {
  const response = await axios.put(`${BASE_URL}/tasks/${taskId}`, data);
  return response.data;
};
