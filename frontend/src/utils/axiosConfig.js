import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  async (config) => {
    try {
      const token = await window?.Clerk?.session?.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      // ignore
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
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
