const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const API_ENDPOINTS = {
  LOGS: `${API_BASE_URL}/logs/`,
  TODOS: `${API_BASE_URL}/todos/`,
  GITHUB: `${API_BASE_URL}/github/`,
};

export default API_BASE_URL;
