import api from './axios';

export const getReviewContext = async (ownerUserId, bookingId) => {
  const response = await api.get(`/users/${ownerUserId}/bookings/${bookingId}/review-context`);
  return response.data;
};

export const createReview = async (ownerUserId, bookingId, payload) => {
  const response = await api.post(`/users/${ownerUserId}/bookings/${bookingId}/reviews`, payload);
  return response.data;
};

export const getMyReviews = async (ownerUserId) => {
  const response = await api.get(`/users/${ownerUserId}/reviews`);
  return response.data;
};
