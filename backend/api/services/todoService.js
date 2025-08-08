const Todo = require("../models/todoModel");

const getAllTodos = async (userId, queryParams = {}) => {
  const { q, status, from, to, includeCompleted } = queryParams;
  const filter = { user: userId };

  if (q && typeof q === "string" && q.trim().length > 0) {
    filter.task = { $regex: q.trim(), $options: "i" };
  }

  if (status) {
    const statuses = Array.isArray(status)
      ? status
      : String(status)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
    if (statuses.length > 0) {
      filter.status = { $in: statuses };
    }
  }

  if (from || to) {
    filter.createdAt = {};
    if (from) {
      const fromDate = new Date(from);
      if (!isNaN(fromDate)) {
        fromDate.setHours(0, 0, 0, 0);
        filter.createdAt.$gte = fromDate;
      }
    }
    if (to) {
      const toDate = new Date(to);
      if (!isNaN(toDate)) {
        toDate.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = toDate;
      }
    }
  }

  if (includeCompleted === "false" || includeCompleted === false) {
    filter.isCompleted = { $ne: true };
  }

  return await Todo.find(filter).sort({ createdAt: -1 });
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
