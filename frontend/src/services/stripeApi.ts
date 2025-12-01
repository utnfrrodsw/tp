import { api } from './api';

export const stripeApi = {
  create: () => {
    const token = localStorage.getItem('token');
    return api.post(
      '/stripe',
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  pay: (paymentData: {
    amount: number;
    sellerStripeId: string;
    turno: number;
    userMail: string;
    userID: number;
  }) => {
    const token = localStorage.getItem('token');
    return api.post('/stripe/split-payment', paymentData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
