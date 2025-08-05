import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo?.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
      config.headers["x-refresh-token"] = userInfo.refreshToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    // Check if there's a new access token in the response headers
    const newAccessToken = response.headers["x-new-access-token"];
    if (newAccessToken) {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      userInfo.token = newAccessToken;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
