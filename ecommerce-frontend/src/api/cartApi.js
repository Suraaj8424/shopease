import axiosInstance from './axiosInstance';

export const getCart = () =>
  axiosInstance.get('/api/cart');

export const addToCart = (data) =>
  axiosInstance.post('/api/cart/add', data);

export const updateCartItem = (cartItemId, quantity) =>
  axiosInstance.put(`/api/cart/${cartItemId}?quantity=${quantity}`);

export const removeFromCart = (cartItemId) =>
  axiosInstance.delete(`/api/cart/${cartItemId}`);