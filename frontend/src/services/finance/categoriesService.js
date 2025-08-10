import axios from "../../utils/axiosConfig";
import { API_ENDPOINTS } from "../../config/api";

const BASE = API_ENDPOINTS.FINANCE_CATEGORIES;

export const listCategories = async (params = {}) => {
  const response = await axios.get(BASE, { params });
  return response.data;
};

export const createCategory = async (payload) => {
  const response = await axios.post(BASE, payload);
  return response.data;
};

export const updateCategory = async (id, updates) => {
  const response = await axios.put(`${BASE}/${id}`, updates);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await axios.delete(`${BASE}/${id}`);
  return response.data;
};

export default {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
