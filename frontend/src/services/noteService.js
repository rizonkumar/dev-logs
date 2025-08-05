import axios from "../utils/axiosConfig";
import { API_ENDPOINTS } from "../config/api.js";

const API_URL = API_ENDPOINTS.NOTES;

const getNotes = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const createNote = async (noteData) => {
  const response = await axios.post(API_URL, noteData);
  return response.data;
};

const updateNote = async (noteId, updateData) => {
  const response = await axios.put(API_URL + noteId, updateData);
  return response.data;
};

const deleteNote = async (noteId) => {
  const response = await axios.delete(API_URL + noteId);
  return response.data;
};

const noteService = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
};

export default noteService;
