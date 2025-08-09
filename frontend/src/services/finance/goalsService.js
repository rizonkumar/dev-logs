import axios from "../../utils/axiosConfig";
import { API_ENDPOINTS } from "../../config/api";

const BASE = API_ENDPOINTS.FINANCE_GOALS;

export const listGoals = async () => {
  const response = await axios.get(BASE);
  return response.data;
};

export const createGoal = async (payload) => {
  const response = await axios.post(BASE, payload);
  return response.data;
};

export const addContribution = async (goalId, payload) => {
  const response = await axios.post(`${BASE}${goalId}/contributions`, payload);
  return response.data;
};

export const deleteGoal = async (id) => {
  const response = await axios.delete(`${BASE}${id}`);
  return response.data;
};

export default { listGoals, createGoal, addContribution, deleteGoal };
