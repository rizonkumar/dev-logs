import axios from "axios";

const API_URL = "http://localhost:5001/api/github/";

const fetchGithubContributions = async () => {
  const response = await axios.get(API_URL + "contributions");
  return response.data;
};

const githubService = {
  fetchGithubContributions,
};

export default githubService;
