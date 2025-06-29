import axios from "axios";
import { API_ENDPOINTS } from "../config/api.js";

const API_URL = API_ENDPOINTS.GITHUB;

const fetchGithubContributions = async () => {
  const response = await axios.get(API_URL + "contributions");
  return response.data;
};

const githubService = {
  fetchGithubContributions,
};

export default githubService;
