const Todo = require("../models/todoModel");

const getAllTodos = async (userId, queryParams = {}) => {
  const { q, status, from, to, includeCompleted, tags, tag } = queryParams;
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

  // Filter by tags (matches any of the provided tags)
  // Supports: tags=Work,DevDeck or tags[]=Work&tags[]=DevDeck, and tag=Work
  const tagsToFilter = [];
  if (Array.isArray(tags)) {
    tags.forEach((t) => {
      if (typeof t === "string") {
        const cleaned = t.trim();
        if (cleaned.length > 0) tagsToFilter.push(cleaned);
      }
    });
  } else if (typeof tags === "string") {
    tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .forEach((t) => tagsToFilter.push(t));
  }

  if (typeof tag === "string" && tag.trim().length > 0) {
    tagsToFilter.push(tag.trim());
  }

  if (tagsToFilter.length > 0) {
    filter.tags = { $in: [...new Set(tagsToFilter)] };
  }

  return await Todo.find(filter).sort({ createdAt: -1 });
};

const createNewTodo = async (userId, todoData) => {
  const { task, status, isCompleted } = todoData;
  let tagsInput = todoData.tags ?? [];
  if (typeof tagsInput === "string") {
    tagsInput = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  const cleanedTags = Array.isArray(tagsInput)
    ? [
        ...new Set(
          tagsInput.map((tag) => tag.trim()).filter((tag) => tag.length > 0)
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
  if (Object.prototype.hasOwnProperty.call(updateData, "tags")) {
    let tagsInput = updateData.tags;
    if (typeof tagsInput === "string") {
      tagsInput = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
    if (Array.isArray(tagsInput)) {
      updateData.tags = [
        ...new Set(
          tagsInput.map((tag) => tag.trim()).filter((tag) => tag.length > 0)
        ),
      ];
    } else {
      updateData.tags = [];
    }
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
