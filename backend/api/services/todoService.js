const Todo = require("../models/todoModel");

const getAllTodos = async () => {
  return await Todo.find({}).sort({ createdAt: -1 });
};

const createNewTodo = async (todoData) => {
  return await Todo.create({ task: todoData.task });
};

const updateTodoById = async (todoId, updateData) => {
  return await Todo.findByIdAndUpdate(todoId, updateData, {
    new: true,
    runValidators: true,
  });
};

const deleteTodoById = async (todoId) => {
  return await Todo.findByIdAndDelete(todoId);
};

module.exports = {
  getAllTodos,
  createNewTodo,
  updateTodoById,
  deleteTodoById,
};
