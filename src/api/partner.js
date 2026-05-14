import api from './axios';

export const getPartnerDashboardSummary = async () => {
    const response = await api.get('/partner/dashboard/summary');
    return response.data?.result || response.data;
};

export const getPartnerProfile = async () => {
    const response = await api.get('/partner/profile');
    return response.data?.result || response.data;
};

export const updatePartnerProfile = async (payload) => {
    const response = await api.put('/partner/profile', payload);
    return response.data?.result || response.data;
};

export const getPartnerServices = async () => {
    const response = await api.get('/partner/services');
    return response.data?.result || response.data;
};

export const createPartnerService = async (payload) => {
    const response = await api.post('/partner/services', payload);
    return response.data?.result || response.data;
};

export const updatePartnerService = async (id, payload) => {
    const response = await api.put(`/partner/services/${id}`, payload);
    return response.data?.result || response.data;
};

export const updatePartnerServiceStatus = async (id, active) => {
    const response = await api.patch(`/partner/services/${id}/status`, { active });
    return response.data?.result || response.data;
};

export const archivePartnerService = async (id) => {
    const response = await api.delete(`/partner/services/${id}`);
    return response.data?.result || response.data;
};

export const getPartnerSchedule = async (params = {}) => {
    const response = await api.get('/partner/schedule', { params });
    return response.data?.result || response.data;
};

export const updatePartnerWeeklySchedule = async (weeklyHours) => {
    const response = await api.put('/partner/schedule/weekly', { weeklyHours });
    return response.data?.result || response.data;
};

export const getPartnerBookings = async (params = {}) => {
    const response = await api.get('/partner/bookings', { params });
    return response.data?.result || response.data;
};

export const getPartnerBookingDetail = async (id) => {
    const response = await api.get(`/partner/bookings/${id}`);
    return response.data?.result || response.data;
};

export const confirmPartnerBooking = async (id, payload = {}) => {
    const response = await api.post(`/partner/bookings/${id}/confirm`, payload);
    return response.data?.result || response.data;
};

export const startPartnerBooking = async (id, payload = {}) => {
    const response = await api.post(`/partner/bookings/${id}/start`, payload);
    return response.data?.result || response.data;
};

export const completePartnerBooking = async (id, payload = {}) => {
    const response = await api.post(`/partner/bookings/${id}/complete`, payload);
    return response.data?.result || response.data;
};

export const cancelPartnerBooking = async (id, payload = {}) => {
    const response = await api.post(`/partner/bookings/${id}/cancel`, payload);
    return response.data?.result || response.data;
};

export const updatePartnerBookingInternalNote = async (id, internalNote) => {
    const response = await api.put(`/partner/bookings/${id}/internal-note`, { internalNote });
    return response.data?.result || response.data;
};

export const getPartnerRevenueSummary = async (params = {}) => {
    const response = await api.get('/partner/revenue/summary', { params });
    return response.data?.result || response.data;
};

export const getPartnerInvoices = async (params = {}) => {
    const response = await api.get('/partner/invoices', { params });
    return response.data?.result || response.data;
};

export const getPartnerInvoiceDetail = async (id) => {
    const response = await api.get(`/partner/invoices/${id}`);
    return response.data?.result || response.data;
};