import axios from "../../utils/axiosConfig";
import { API_ENDPOINTS } from "../../config/api";

export const getOverview = async () => {
  const response = await axios.get(
    `${API_ENDPOINTS.FINANCE_DASHBOARD}overview`
  );
  return response.data;
};

export default { getOverview };
