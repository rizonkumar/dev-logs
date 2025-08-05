const Todo = require("../models/todoModel");

const getAllTodos = async (userId) => {
  return await Todo.find({ user: userId }).sort({ createdAt: -1 });
};

const createNewTodo = async (userId, todoData) => {
  const { task, status, tags = [], isCompleted } = todoData;
  const cleanedTags = tags
    ? [
        ...new Set(
          tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0)
        ),
      ]
    : [];

  return await Todo.create({
    user: userId,
    task,
    status,
    tags: cleanedTags,
    isCompleted,
  });
};

const updateTodoById = async (userId, todoId, updateData) => {
  if (updateData.tags) {
    updateData.tags = [
      ...new Set(
        updateData.tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0)
      ),
    ];
  }

  const todo = await Todo.findOne({ _id: todoId, user: userId });

  if (!todo) {
    const error = new Error("Todo not found or user not authorized");
    error.statusCode = 404;
    throw error;
  }

  Object.assign(todo, updateData);
  await todo.save();
  return todo;
};

const deleteTodoById = async (userId, todoId) => {
  const todo = await Todo.findOne({ _id: todoId, user: userId });
  if (!todo) {
    const error = new Error("Todo not found or user not authorized");
    error.statusCode = 404;
    throw error;
  }
  await todo.deleteOne();
  return todo;
};

const getTodoById = async (userId, todoId) => {
  const todo = await Todo.findOne({ _id: todoId, user: userId });
  if (!todo) {
    const error = new Error("Todo not found or user not authorized");
    error.statusCode = 404;
    throw error;
  }
  return todo;
};

module.exports = {
  getAllTodos,
  createNewTodo,
  updateTodoById,
  deleteTodoById,
  getTodoById,
};
