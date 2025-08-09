import axios from "../../utils/axiosConfig";
import { API_ENDPOINTS } from "../../config/api";

const BASE = API_ENDPOINTS.FINANCE_BUDGETS;

export const listBudgets = async (params = {}) => {
  const response = await axios.get(BASE, { params });
  return response.data;
};

export const createBudget = async (payload) => {
  const response = await axios.post(BASE, payload);
  return response.data;
};

export const updateBudget = async (id, payload) => {
  const response = await axios.put(`${BASE}${id}`, payload);
  return response.data;
};

export const deleteBudget = async (id) => {
  const response = await axios.delete(`${BASE}${id}`);
  return response.data;
};

export const getBudgetProgress = async ({ categoryId, month, year }) => {
  const response = await axios.get(`${BASE}progress`, {
    params: { categoryId, month, year },
  });
  return response.data;
};

export default { listBudgets, createBudget, updateBudget, deleteBudget, getBudgetProgress };
