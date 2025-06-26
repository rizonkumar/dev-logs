import axios from "axios";

const API_URL = "http://localhost:5001/api/logs/";

const fetchAllLogs = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const createLog = async (logData) => {
  const response = await axios.post(API_URL, logData);
  return response.data;
};

const deleteLog = async (logId) => {
  const response = await axios.delete(API_URL + logId);
  return response.data;
};

const updateLog = async (logId, updateData) => {
  const response = await axios.put(API_URL + logId, updateData);
  return response.data;
};

const logService = {
  fetchAllLogs,
  createLog,
  deleteLog,
  updateLog,
};

export default logService;
