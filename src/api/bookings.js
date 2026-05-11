import api from './axios';

export const getBookingCreateContext = async (params = {}) => {
  const response = await api.get('/bookings/create-context', { params });
  return response.data;
};

export const createBooking = async (payload) => {
  const response = await api.post('/bookings', payload);
  return response.data;
};

export const getBookingSummary = async (bookingId) => {
  const response = await api.get(`/bookings/${bookingId}/summary`);
  return response.data;
};

export const getMyBookings = async (ownerUserId, status = 'ALL') => {
  const response = await api.get(`/users/${ownerUserId}/bookings`, {
    params: { status },
  });
  return response.data;
};

export const getBookingDetail = async (ownerUserId, bookingId) => {
  const response = await api.get(`/users/${ownerUserId}/bookings/${bookingId}`);
  return response.data;
};

export const getBookingRescheduleContext = async (ownerUserId, bookingId) => {
  const response = await api.get(`/users/${ownerUserId}/bookings/${bookingId}/reschedule-context`);
  return response.data;
};

export const rescheduleBooking = async (ownerUserId, bookingId, payload) => {
  const response = await api.post(`/users/${ownerUserId}/bookings/${bookingId}/reschedule`, payload);
  return response.data;
};

export const cancelBooking = async (ownerUserId, bookingId, payload) => {
  const response = await api.post(`/users/${ownerUserId}/bookings/${bookingId}/cancel`, payload);
  return response.data;
};
