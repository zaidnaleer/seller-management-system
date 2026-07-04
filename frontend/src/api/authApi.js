import axiosClient from './axiosClient';

export const registerUser = async (email, password) => {
  const response = await axiosClient.post('/auth/register', { email, password });
  return response.data; // { token, email, role }
};

export const loginUser = async (email, password) => {
  const response = await axiosClient.post('/auth/login', { email, password });
  return response.data; // { token, email, role }
};