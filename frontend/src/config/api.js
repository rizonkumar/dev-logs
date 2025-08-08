const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  if (import.meta.env.DEV) {
    return "http://localhost:5001/api";
  } else {
    return "https://dev-logs-backend.vercel.app/api";
  }
};

const API_BASE_URL = getApiUrl();

console.log(`🔗 API Base URL: ${API_BASE_URL}`);
console.log(
  `📍 Environment: ${import.meta.env.DEV ? "Development" : "Production"}`
);

export const API_ENDPOINTS = {
  LOGS: `${API_BASE_URL}/logs/`,
  TODOS: `${API_BASE_URL}/todos/`,
  GITHUB: `${API_BASE_URL}/github/`,
  POMODOROS: `${API_BASE_URL}/pomodoros/`,
  REVIEWS: `${API_BASE_URL}/reviews/`,
  USERS: `${API_BASE_URL}/users/`,
  NOTES: `${API_BASE_URL}/notes/`,
  FINANCE: `${API_BASE_URL}/finance/`,
  FINANCE_TRANSACTIONS: `${API_BASE_URL}/finance/transactions/`,
  FINANCE_CATEGORIES: `${API_BASE_URL}/finance/categories/`,
  FINANCE_BUDGETS: `${API_BASE_URL}/finance/budgets/`,
  FINANCE_GOALS: `${API_BASE_URL}/finance/goals/`,
  FINANCE_PROJECTS: `${API_BASE_URL}/finance/projects/`,
  FINANCE_DASHBOARD: `${API_BASE_URL}/finance/dashboard/`,
  FINANCE_CALCULATORS: `${API_BASE_URL}/finance/calculators/`,
};

export default API_BASE_URL;
