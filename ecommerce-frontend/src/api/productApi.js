import axiosInstance from './axiosInstance';

export const getAllProducts = (page = 0, size = 10, sortBy = 'name') =>
  axiosInstance.get(`/api/products?page=${page}&size=${size}&sortBy=${sortBy}`);

export const getProductById = (id) =>
  axiosInstance.get(`/api/products/${id}`);

export const searchProducts = (keyword, page = 0, size = 10) =>
  axiosInstance.get(`/api/products/search?keyword=${keyword}&page=${page}&size=${size}`);

export const createProduct = (data) =>
  axiosInstance.post('/api/products', data);

export const updateProduct = (id, data) =>
  axiosInstance.put(`/api/products/${id}`, data);

export const deleteProduct = (id) =>
  axiosInstance.delete(`/api/products/${id}`);