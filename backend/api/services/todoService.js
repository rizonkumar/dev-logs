const Todo = require("../models/todoModel");

const getAllTodos = async () => {
  return await Todo.find({}).sort({ createdAt: -1 });
};

const createNewTodo = async (todoData) => {
  const { task, status, tags = [], isCompleted } = todoData;

  const cleanedTags = tags
    ? [
        ...new Set(
          tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0)
        ),
      ]
    : [];

  return await Todo.create({ task, status, tags: cleanedTags, isCompleted });
};

const updateTodoById = async (todoId, updateData) => {
  if (updateData.tags) {
    updateData.tags = [
      ...new Set(
        updateData.tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0)
      ),
    ];
  }

  return await Todo.findByIdAndUpdate(todoId, updateData, {
    new: true,
    runValidators: true,
  });
};

const deleteTodoById = async (todoId) => {
  return await Todo.findByIdAndDelete(todoId);
};

const getTodoById = async (todoId) => {
  return await Todo.findById(todoId);
};

module.exports = {
  getAllTodos,
  createNewTodo,
  updateTodoById,
  deleteTodoById,
  getTodoById,
};
