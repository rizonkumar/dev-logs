import axios from "axios";
import { API_ENDPOINTS } from "../config/api.js";

const API_URL = API_ENDPOINTS.POMODOROS;

const logPomodoroSession = async (sessionData) => {
  const response = await axios.post(API_URL, sessionData);
  return response.data;
};

const fetchPomodoroStats = async () => {
  const response = await axios.get(API_URL + "stats");
  return response.data;
};

const pomodoroService = {
  logPomodoroSession,
  fetchPomodoroStats,
};

export default pomodoroService;
