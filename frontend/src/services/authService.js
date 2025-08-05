import axios from "axios";
import { API_ENDPOINTS } from "../config/api.js";

const API_URL = API_ENDPOINTS.USERS;

const register = async (userData) => {
  const response = await axios.post(API_URL + "register", userData);

  if (response.data) {
    localStorage.setItem("userInfo", JSON.stringify(response.data));
  }

  return response.data;
};

const login = async (userData) => {
  const response = await axios.post(API_URL + "login", userData);

  if (response.data) {
    localStorage.setItem("userInfo", JSON.stringify(response.data));
  }

  return response.data;
};

const logout = () => {
  localStorage.removeItem("userInfo");
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
