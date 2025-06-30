import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  X,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Edit3,
  Trash2,
  Save,
  Plus,
  Target,
  ListTodo,
  Timer,
} from "lucide-react";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../app/features/todosSlice";

const DetailedTodoModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { todos, status } = useSelector((state) => state.todos);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (isOpen && status === "idle") {
      dispatch(fetchTodos());
    }
  }, [isOpen, status, dispatch]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (newTask.trim() === "") return;

    await dispatch(createTodo({ task: newTask }));
    setNewTask("");
  };

  const handleToggleComplete = async (todo) => {
    await dispatch(
      updateTodo({
        todoId: todo._id,
        updateData: { isCompleted: !todo.isCompleted },
      })
    );
  };

  const handleEdit = (todo) => {
    setEditingId(todo._id);
    setEditingText(todo.task);
  };

  const handleSaveEdit = async () => {
    if (editingText.trim() === "") return;

    await dispatch(
      updateTodo({
        todoId: editingId,
        updateData: { task: editingText },
      })
    );
    setEditingId(null);
    setEditingText("");
  };

  const handleDelete = async (todoId) => {
    await dispatch(deleteTodo(todoId));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.isCompleted;
    if (filter === "pending") return !todo.isCompleted;
    return true;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter((todo) => todo.isCompleted).length,
    pending: todos.filter((todo) => !todo.isCompleted).length,
  };

  const completionPercentage =
    stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity p-4">
      <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] border border-gray-700/50 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-teal-600/20 p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/30">
                <ListTodo className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center">
                  Task Manager
                  <span className="ml-3 text-sm font-normal bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
                    {stats.total} tasks
                  </span>
                </h2>
                <p className="text-gray-300 text-sm mt-1">
                  Organize and track your development tasks
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-gray-700/50 hover:bg-gray-600/50 flex items-center justify-center transition-all duration-300 border border-gray-600/50 hover:border-gray-500/50"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs font-medium">
                    Total Tasks
                  </p>
                  <p className="text-white text-xl font-bold">{stats.total}</p>
                </div>
                <Target className="w-6 h-6 text-gray-400" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-xs font-medium">
                    Completed
                  </p>
                  <p className="text-white text-xl font-bold">
                    {stats.completed}
                  </p>
                </div>
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-400 text-xs font-medium">Pending</p>
                  <p className="text-white text-xl font-bold">
                    {stats.pending}
                  </p>
                </div>
                <Timer className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-xs font-medium">
                    Progress
                  </p>
                  <p className="text-white text-xl font-bold">
                    {Math.round(completionPercentage)}%
                  </p>
                </div>
                <div className="w-6 h-6 relative">
                  <div className="w-6 h-6 rounded-full border-2 border-purple-500/30"></div>
                  <div
                    className="absolute top-0 left-0 w-6 h-6 rounded-full border-2 border-purple-400 transition-all duration-300"
                    style={{
                      background: `conic-gradient(#a855f7 ${
                        completionPercentage * 3.6
                      }deg, transparent 0deg)`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col h-full max-h-[60vh] overflow-hidden">
          <div className="p-6 border-b border-gray-700/50">
            <form onSubmit={handleAddTask} className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Add a new task... (e.g., Fix authentication bug, Update documentation)"
                  className="w-full bg-gray-900/70 px-4 py-3 pl-12 rounded-xl border border-gray-600/50 
                            focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:outline-none 
                            transition-all duration-300 text-gray-300 placeholder-gray-500"
                />
                <Plus className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
              <button
                type="submit"
                disabled={!newTask.trim() || status === "loading"}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 
                          text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 
                          flex items-center space-x-2 shadow-lg shadow-blue-500/25
                          disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </button>
            </form>
          </div>

          <div className="px-6 pt-4 pb-2">
            <div className="flex space-x-1 bg-gray-900/50 rounded-xl p-1 w-fit">
              {[
                { key: "all", label: "All Tasks", count: stats.total },
                { key: "pending", label: "Pending", count: stats.pending },
                {
                  key: "completed",
                  label: "Completed",
                  count: stats.completed,
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                    filter === tab.key
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="bg-gray-700/50 text-xs px-2 py-0.5 rounded-full">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tasks List */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gray-800/50 flex items-center justify-center">
                  <ListTodo className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-gray-400 text-lg font-medium mb-2">
                  {filter === "all" ? "No tasks yet" : `No ${filter} tasks`}
                </p>
                <p className="text-gray-500 text-sm">
                  {filter === "all"
                    ? "Add your first task to get started"
                    : `Switch to another filter to see more tasks`}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTodos.map((todo) => (
                  <div
                    key={todo._id}
                    className={`bg-gray-800/40 rounded-xl p-4 border transition-all duration-300 hover:shadow-lg ${
                      todo.isCompleted
                        ? "border-green-500/20 bg-green-500/5"
                        : "border-gray-700/30 hover:border-gray-600/50"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleToggleComplete(todo)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                          todo.isCompleted
                            ? "border-green-500 bg-green-500 text-white"
                            : "border-gray-500 hover:border-green-400"
                        }`}
                      >
                        {todo.isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Circle className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                        )}
                      </button>

                      <div className="flex-1">
                        {editingId === todo._id ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="flex-1 bg-gray-900/70 px-3 py-2 rounded-lg border border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-300"
                              autoFocus
                            />
                            <button
                              onClick={handleSaveEdit}
                              className="px-3 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-3 py-2 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p
                                className={`transition-all duration-300 ${
                                  todo.isCompleted
                                    ? "text-gray-500 line-through"
                                    : "text-gray-200"
                                }`}
                              >
                                {todo.task}
                              </p>
                              {todo.createdAt && (
                                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>
                                      {new Date(
                                        todo.createdAt
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3" />
                                    <span>
                                      {new Date(
                                        todo.createdAt
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => handleEdit(todo)}
                                className="p-2 text-gray-500 hover:text-blue-400 rounded-lg hover:bg-blue-500/10 transition-all duration-300"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(todo._id)}
                                className="p-2 text-gray-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all duration-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedTodoModal;
