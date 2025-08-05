import axios from "../utils/axiosConfig";
import { API_ENDPOINTS } from "../config/api.js";

const API_URL = API_ENDPOINTS.USERS;

const updateUserProfile = async (userData) => {
  const formData = new FormData();

  Object.keys(userData).forEach((key) => {
    if (key === "profileImage" && userData[key] instanceof File) {
      formData.append(key, userData[key]);
    } else if (key !== "profileImage") {
      formData.append(key, userData[key]);
    }
  });

  const response = await axios.put(API_URL + "profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (response.data) {
    localStorage.setItem("userInfo", JSON.stringify(response.data));
  }

  return response.data;
};

const getUserProfile = async () => {
  const response = await axios.get(API_URL + "profile");
  return response.data;
};

const userService = {
  updateUserProfile,
  getUserProfile,
};

export default userService;
