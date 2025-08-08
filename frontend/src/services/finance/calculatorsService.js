import axios from "../../utils/axiosConfig";
import { API_ENDPOINTS } from "../../config/api";

const BASE = API_ENDPOINTS.FINANCE_CALCULATORS;

export const contractVsFullTime = async (payload) => {
  const response = await axios.post(`${BASE}contract-vs-fulltime`, payload);
  return response.data;
};

export const fire = async (payload) => {
  const response = await axios.post(`${BASE}fire`, payload);
  return response.data;
};

export default { contractVsFullTime, fire };
