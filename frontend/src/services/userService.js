import axios from "../utils/axiosConfig";
import { API_ENDPOINTS } from "../config/api.js";

const API_URL = API_ENDPOINTS.USERS;

/**
 * Updates the user's profile information.
 * @param {object} userData - Contains name, email, and optionally profileImage file.
 * @returns {Promise<object>} The updated user data from the API.
 */
const updateUserProfile = async (userData) => {
  const formData = new FormData();
  formData.append("name", userData.name);
  formData.append("email", userData.email);
  if (userData.profileImage) {
    formData.append("profileImage", userData.profileImage);
  }

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

const userService = {
  updateUserProfile,
};

export default userService;
