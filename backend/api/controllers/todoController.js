const asyncHandler = require("../middleware/asyncHandler");
const todoService = require("../services/todoService");

const getTodos = asyncHandler(async (req, res) => {
  const todos = await todoService.getAllTodos();
  res.status(200).json(todos);
});

const createTodo = asyncHandler(async (req, res) => {
  const { task } = req.body;
  const newTodo = await todoService.createNewTodo({ task });
  res.status(201).json(newTodo);
});

const updateTodo = asyncHandler(async (req, res) => {
  const todoId = req.params.id;
  const { task, isCompleted } = req.body;

  const updateData = {};
  if (task !== undefined) updateData.task = task;
  if (isCompleted !== undefined) updateData.isCompleted = isCompleted;

  const updatedTodo = await todoService.updateTodoById(todoId, updateData);

  if (!updatedTodo) {
    res.status(404);
    throw new Error("Todo not found");
  }

  res.status(200).json(updatedTodo);
});

const deleteTodo = asyncHandler(async (req, res) => {
  const todoId = req.params.id;
  const todo = await todoService.deleteTodoById(todoId);

  if (!todo) {
    res.status(404);
    throw new Error("Todo not found");
  }

  res.status(200).json({ id: todoId, message: "Todo removed successfully" });
});

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
