import api from './axios';

export const getOwnerPets = async (ownerUserId) => {
  const response = await api.get(`/users/${ownerUserId}/pets`);
  return response.data;
};

export const getPetDetail = async (ownerUserId, petId) => {
  const response = await api.get(`/users/${ownerUserId}/pets/${petId}`);
  return response.data;
};

export const createPet = async (ownerUserId, payload) => {
  const response = await api.post(`/users/${ownerUserId}/pets`, payload);
  return response.data;
};

export const updatePet = async (ownerUserId, petId, payload) => {
  const response = await api.put(`/users/${ownerUserId}/pets/${petId}`, payload);
  return response.data;
};

export const deletePet = async (ownerUserId, petId) => {
  const response = await api.delete(`/users/${ownerUserId}/pets/${petId}`);
  return response.data;
};
