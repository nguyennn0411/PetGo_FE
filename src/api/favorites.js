import api from './axios';

export const getFavorites = async (ownerUserId, params = {}) => {
  const response = await api.get(`/users/${ownerUserId}/favorites`, { params });
  return response.data;
};

export const getFavoriteProviderIds = async (ownerUserId) => {
  const response = await api.get(`/users/${ownerUserId}/favorites/provider-ids`);
  return response.data;
};

export const addFavoriteProvider = async (ownerUserId, providerId) => {
  const response = await api.post(`/users/${ownerUserId}/favorites/providers/${providerId}`);
  return response.data;
};

export const removeFavoriteProvider = async (ownerUserId, providerId) => {
  const response = await api.delete(`/users/${ownerUserId}/favorites/providers/${providerId}`);
  return response.data;
};
