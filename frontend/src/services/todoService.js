import axios from "axios";
import { API_ENDPOINTS } from "../config/api.js";

const API_URL = API_ENDPOINTS.TODOS;

const fetchAllTodos = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const createTodo = async (todoData) => {
  const response = await axios.post(API_URL, todoData);
  return response.data;
};

const updateTodo = async (todoId, updateData) => {
  const response = await axios.put(API_URL + todoId, updateData);
  return response.data;
};

const deleteTodo = async (todoId) => {
  const response = await axios.delete(API_URL + todoId);
  return response.data;
};

const todoService = {
  fetchAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};

export default todoService;
