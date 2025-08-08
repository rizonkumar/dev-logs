import axios from "../../utils/axiosConfig";
import { API_ENDPOINTS } from "../../config/api";

export const updateFinanceCurrency = async (currencyCode) => {
  const form = new FormData();
  form.append("financeCurrency", currencyCode);
  const response = await axios.put(API_ENDPOINTS.USERS + "profile", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (response.data) {
    localStorage.setItem("userInfo", JSON.stringify(response.data));
  }
  return response.data;
};

export default { updateFinanceCurrency };


