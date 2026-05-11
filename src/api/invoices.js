import api from './axios';

export const getInvoiceById = async (invoiceId) => {
  const response = await api.get(`/invoices/${invoiceId}`);
  return response.data;
};

export const getInvoiceByBookingId = async (bookingId) => {
  const response = await api.get(`/invoices/by-booking/${bookingId}`);
  return response.data;
};
