const asyncHandler = require("../middleware/asyncHandler");
const todoService = require("../services/todoService");

const getTodos = asyncHandler(async (req, res) => {
  const todos = await todoService.getAllTodos(req.user.id, req.query || {});
  res.status(200).json(todos);
});

const createTodo = asyncHandler(async (req, res) => {
  const newTodo = await todoService.createNewTodo(req.user.id, req.body);
  res.status(201).json(newTodo);
});

const updateTodo = asyncHandler(async (req, res) => {
  const todoId = req.params.id;
  const updatedTodo = await todoService.updateTodoById(
    req.user.id,
    todoId,
    req.body
  );
  res.status(200).json(updatedTodo);
});

const deleteTodo = asyncHandler(async (req, res) => {
  const todoId = req.params.id;
  await todoService.deleteTodoById(req.user.id, todoId);
  res.status(200).json({ id: todoId, message: "Todo removed successfully" });
});

const getTodo = asyncHandler(async (req, res) => {
  const todoId = req.params.id;
  const todo = await todoService.getTodoById(req.user.id, todoId);
  res.status(200).json(todo);
});

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodo,
};
