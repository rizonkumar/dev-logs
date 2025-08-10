import axios from "../../utils/axiosConfig";
import { API_ENDPOINTS } from "../../config/api";

const BASE = API_ENDPOINTS.FINANCE_TRANSACTIONS;

export const listBills = async (params = {}) => {
  const response = await axios.get(BASE, {
    params: {
      ...params,
      type: "EXPENSE",
      status: "SCHEDULED",
      dateField: "dueDate",
      sort: params.sort || "oldest",
    },
  });
  return response.data;
};

export const createBill = async (payload) => {
  const response = await axios.post(BASE, {
    ...payload,
    type: "EXPENSE",
    status: "SCHEDULED",
  });
  return response.data;
};

export const updateBill = async (id, payload) => {
  const response = await axios.put(`${BASE}${id}`, {
    ...payload,
    type: "EXPENSE",
    status: "SCHEDULED",
  });
  return response.data;
};

export const deleteBill = async (id) => {
  const response = await axios.delete(`${BASE}${id}`);
  return response.data;
};

export default { listBills, createBill, updateBill, deleteBill };
