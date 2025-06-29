import axios from "axios";
import { API_ENDPOINTS } from "../config/api.js";

const API_URL = API_ENDPOINTS.LOGS;

const fetchAllLogs = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const createLog = async (logData) => {
  try {
    const response = await axios.post(API_URL, logData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteLog = async (logId) => {
  const response = await axios.delete(API_URL + logId);
  return response.data;
};

const updateLog = async (logId, updateData) => {
  const response = await axios.put(API_URL + logId, updateData);
  return response.data;
};

const fetchLogStats = async () => {
  const response = await axios.get(API_URL + "stats");
  return response.data;
};

const logService = {
  fetchAllLogs,
  createLog,
  deleteLog,
  updateLog,
  fetchLogStats,
};

export default logService;
