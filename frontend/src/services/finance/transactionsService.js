import axios from "../../utils/axiosConfig";
import { API_ENDPOINTS } from "../../config/api";

const BASE = API_ENDPOINTS.FINANCE_TRANSACTIONS;

export const listTransactions = async (params = {}) => {
  const response = await axios.get(BASE, { params });
  return response.data;
};

export const createTransaction = async (payload) => {
  const response = await axios.post(BASE, payload);
  return response.data;
};

export const getTransaction = async (id) => {
  const response = await axios.get(`${BASE}${id}`);
  return response.data;
};

export const updateTransaction = async (id, payload) => {
  const response = await axios.put(`${BASE}${id}`, payload);
  return response.data;
};

export const deleteTransaction = async (id) => {
  const response = await axios.delete(`${BASE}${id}`);
  return response.data;
};

export default {
  listTransactions,
  createTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction,
};
