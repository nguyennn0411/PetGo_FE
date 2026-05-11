import api from './axios';

export const getPaymentCheckoutContext = async ({ bookingId, promoCode } = {}) => {
  const response = await api.get('/payments/checkout-context', {
    params: {
      bookingId,
      promoCode: promoCode || undefined,
    },
  });
  return response.data;
};

export const checkoutPayment = async (payload) => {
  const response = await api.post('/payments/checkout', payload);
  return response.data;
};
