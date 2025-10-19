import axios from 'axios';
const API_URL = 'http://localhost:5000/api/teams';

export const createTeam = async (leader, visualType) => {
  const res = await axios.post(`${API_URL}/create`, { leader, visualType });
  return res.data;
};

export const joinTeam = async (nickname, teamCode) => {
  const res = await axios.post(`${API_URL}/join`, { nickname, teamCode });
  return res.data;
};

export const getTeam = async (teamCode) => {
  const res = await axios.get(`${API_URL}/${teamCode}`);
  return res.data;
};
