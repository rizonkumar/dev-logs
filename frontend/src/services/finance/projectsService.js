import axios from "../../utils/axiosConfig";
import { API_ENDPOINTS } from "../../config/api";

const BASE = API_ENDPOINTS.FINANCE_PROJECTS;

export const listProjects = async () => {
  const response = await axios.get(BASE);
  return response.data;
};

export const createProject = async (payload) => {
  const response = await axios.post(BASE, payload);
  return response.data;
};

export const getProfitability = async (projectId) => {
  const response = await axios.get(`${BASE}${projectId}/profitability`);
  return response.data;
};

export default { listProjects, createProject, getProfitability };
