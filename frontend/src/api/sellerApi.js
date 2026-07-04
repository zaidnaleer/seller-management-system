import axiosClient from './axiosClient';

export const getAllSellers = async (page = 0, size = 20) => {
  const response = await axiosClient.get('/sellers', { params: { page, size } });
  return response.data; // { data: [...], page, size }
};

export const createSeller = async (sellerData) => {
  const response = await axiosClient.post('/sellers', sellerData);
  return response.data; // the created seller object
};

export const updateSeller = async (id, sellerData) => {
  const response = await axiosClient.put(`/sellers/${id}`, sellerData);
  return response.data; // the updated seller object
};

export const deleteSeller = async (id) => {
  await axiosClient.delete(`/sellers/${id}`);
  // 204 No Content — nothing to return
};