import api from './axios';

const unwrap = (response) => response.data?.result || response.data;

export const getAdminNotifications = async () => {
    const response = await api.get('/admin/notifications');
    return unwrap(response);
};

export const createAdminNotification = async (data) => {
    const response = await api.post('/admin/notifications', data);
    return unwrap(response);
};

export const getMyNotifications = async (status = 'ALL') => {
    const response = await api.get('/notifications', { params: { status } });
    return unwrap(response);
};

export const getMyNotificationSummary = async () => {
    const response = await api.get('/notifications/summary');
    return unwrap(response);
};

export const markNotificationAsRead = async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return unwrap(response);
};

export const markAllNotificationsAsRead = async () => {
    const response = await api.put('/notifications/read-all');
    return unwrap(response);
};