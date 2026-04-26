import axiosInstance from './axiosInstance';

export const placeOrder = () =>
  axiosInstance.post('/api/orders/place');

export const getMyOrders = () =>
  axiosInstance.get('/api/orders/my-orders');

export const getOrderById = (id) =>
  axiosInstance.get(`/api/orders/${id}`);

export const processPayment = (data) =>
  axiosInstance.post('/api/orders/payment', data);