import api from './axios';

export const loginRequest = async (payload) => {
  const response = await api.post('/auth/login', payload);
  return response.data;
};

export const registerRequest = async (payload) => {
  const response = await api.post('/auth/register', payload);
  return response.data;
};

export const getMyAccount = async () => {
  const response = await api.get('/auth/me');
  return response.data?.result?.user || response.data?.result || response.data;
};
