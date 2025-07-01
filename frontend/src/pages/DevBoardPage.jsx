import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  fetchTodos,
  updateTodo,
  deleteTodo,
  createTodo,
} from "../app/features/todosSlice";
import {
  Circle,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  GripHorizontal,
  Search,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const COLUMN_COLORS = {
  TODO: {
    bg: "from-blue-500/10 to-blue-600/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    icon: Circle,
  },
  IN_PROGRESS: {
    bg: "from-yellow-500/10 to-orange-500/10",
    border: "border-yellow-500/20",
    text: "text-yellow-400",
    icon: Clock,
  },
  IN_REVIEW: {
    bg: "from-purple-500/10 to-pink-500/10",
    border: "border-purple-500/20",
    text: "text-purple-400",
    icon: AlertCircle,
  },
  DONE: {
    bg: "from-green-500/10 to-emerald-500/10",
    border: "border-green-500/20",
    text: "text-green-400",
    icon: CheckCircle,
  },
};

const DevBoardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { todos, status } = useSelector((state) => state.todos);
  const [columns, setColumns] = useState({
    TODO: [],
    IN_PROGRESS: [],
    IN_REVIEW: [],
    DONE: [],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [newTodo, setNewTodo] = useState({ task: "", status: "TODO" });

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTodos());
    }
  }, [status, dispatch]);

  useEffect(() => {
    // Filter todos based on search and date
    const filteredTodos = todos.filter((todo) => {
      const matchesSearch = todo.task
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesDate = selectedDate
        ? new Date(todo.createdAt).toDateString() ===
          selectedDate.toDateString()
        : true;
      return matchesSearch && matchesDate;
    });

    const newColumns = filteredTodos.reduce(
      (acc, todo) => {
        if (!acc[todo.status]) {
          acc[todo.status] = [];
        }
        acc[todo.status].push(todo);
        return acc;
      },
      {
        TODO: [],
        IN_PROGRESS: [],
        IN_REVIEW: [],
        DONE: [],
      }
    );
    setColumns(newColumns);
  }, [todos, searchTerm, selectedDate]);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const todo = todos.find((t) => t._id === draggableId);
    if (!todo) return;

    dispatch(
      updateTodo({
        todoId: draggableId,
        updateData: {
          status: destination.droppableId,
          isCompleted: destination.droppableId === "DONE",
        },
      })
    );
  };

  const handleAddTodo = () => {
    if (!newTodo.task.trim()) return;
    dispatch(
      createTodo({
        task: newTodo.task,
        status: newTodo.status,
        isCompleted: newTodo.status === "DONE",
      })
    ).then(() => {
      dispatch(fetchTodos());
    });
    setNewTodo({ task: "", status: "TODO" });
    setShowAddModal(false);
  };

  const handleEditTodo = () => {
    if (!selectedTodo || !selectedTodo.task.trim()) return;
    dispatch(
      updateTodo({
        todoId: selectedTodo._id,
        updateData: { task: selectedTodo.task },
      })
    );
    setSelectedTodo(null);
    setShowEditModal(false);
  };

  const handleDeleteTodo = (todoId) => {
    dispatch(deleteTodo(todoId));
    setTodoToDelete(null);
    setShowDeleteModal(false);
  };

  const getColumnTitle = (columnId) => {
    const titles = {
      TODO: "To Do",
      IN_PROGRESS: "In Progress",
      IN_REVIEW: "In Review",
      DONE: "Done",
    };
    return titles[columnId] || columnId;
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 bg-gray-800 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-gray-800/50 hover:bg-gray-800 px-4 py-2 rounded-xl border border-gray-700/50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">Dev Board</h1>
            <p className="text-gray-400">
              Organize and track your development tasks across different stages
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-xl border border-gray-700/50 focus:outline-none focus:border-blue-500/50"
            />
          </div>
          <div className="relative">
            <DatePicker
              selected={selectedDate}
              onChange={setSelectedDate}
              dateFormat="MMM d, yyyy"
              placeholderText="Filter by date"
              className="bg-gray-800 text-white px-4 py-2 rounded-xl border border-gray-700/50 focus:outline-none focus:border-blue-500/50"
            />
            <Calendar className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
          {(searchTerm || selectedDate) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedDate(null);
              }}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Object.entries(COLUMN_COLORS).map(([columnId, theme]) => (
            <div
              key={columnId}
              className={`bg-gradient-to-br ${theme.bg} rounded-xl border ${theme.border} p-4`}
            >
              <div className="flex items-center gap-2 mb-4">
                <theme.icon className={`w-5 h-5 ${theme.text}`} />
                <h2 className="text-lg font-semibold text-white flex items-center">
                  {getColumnTitle(columnId)}
                  <span
                    className={`ml-2 text-sm font-normal ${theme.text} bg-gray-900/30 px-2 py-0.5 rounded-full`}
                  >
                    {columns[columnId]?.length || 0}
                  </span>
                </h2>
              </div>

              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[200px] transition-colors ${
                      snapshot.isDraggingOver ? "bg-gray-800/50" : ""
                    } rounded-lg p-2`}
                  >
                    <div className="space-y-3">
                      {columns[columnId]?.map((todo, index) => (
                        <Draggable
                          key={todo._id}
                          draggableId={todo._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`group p-3 rounded-lg bg-gray-800/90 border border-gray-700/50 
                                ${
                                  snapshot.isDragging
                                    ? "shadow-lg ring-2 ring-blue-500/50"
                                    : ""
                                }
                                hover:border-gray-600/50 transition-all duration-200`}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  {...provided.dragHandleProps}
                                  className="mt-1 p-1 rounded hover:bg-gray-700/50 cursor-grab active:cursor-grabbing"
                                >
                                  <GripHorizontal className="w-4 h-4 text-gray-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p className="text-gray-200 font-medium">
                                      {todo.task}
                                    </p>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button
                                        onClick={() => {
                                          setSelectedTodo(todo);
                                          setShowEditModal(true);
                                        }}
                                        className="p-1 text-gray-400 hover:text-white rounded hover:bg-gray-700/50"
                                      >
                                        <Edit2 className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          setTodoToDelete(todo);
                                          setShowDeleteModal(true);
                                        }}
                                        className="p-1 text-gray-400 hover:text-red-500 rounded hover:bg-gray-700/50"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                  {todo.createdAt && (
                                    <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                                      <Clock className="w-3.5 h-3.5" />
                                      <span>
                                        {new Date(
                                          todo.createdAt
                                        ).toLocaleDateString(undefined, {
                                          month: "short",
                                          day: "numeric",
                                        })}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">
              Add New Task
            </h3>
            <input
              type="text"
              value={newTodo.task}
              onChange={(e) => setNewTodo({ ...newTodo, task: e.target.value })}
              placeholder="Enter task description"
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <select
              value={newTodo.status}
              onChange={(e) =>
                setNewTodo({ ...newTodo, status: e.target.value })
              }
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              {Object.keys(COLUMN_COLORS).map((status) => (
                <option key={status} value={status}>
                  {getColumnTitle(status)}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTodo}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && selectedTodo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">Edit Task</h3>
            <input
              type="text"
              value={selectedTodo.task}
              onChange={(e) =>
                setSelectedTodo({ ...selectedTodo, task: e.target.value })
              }
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedTodo(null);
                  setShowEditModal(false);
                }}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleEditTodo}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && todoToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-2">
              Delete Task
            </h3>
            <p className="text-gray-400 mb-4">
              Are you sure you want to delete this task? This action cannot be
              undone.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => {
                  setTodoToDelete(null);
                  setShowDeleteModal(false);
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTodo(todoToDelete._id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevBoardPage;
