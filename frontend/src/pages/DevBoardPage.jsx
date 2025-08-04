import React, { useState, useEffect, useMemo } from "react";
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
  GripVertical,
  Plus,
  Edit2,
  Trash2,
  X,
  ListTodo,
} from "lucide-react";

const COLUMN_THEME = {
  TODO: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    icon: Circle,
    title: "To Do",
  },
  IN_PROGRESS: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    text: "text-yellow-400",
    icon: Clock,
    title: "In Progress",
  },
  IN_REVIEW: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-400",
    icon: AlertCircle,
    title: "In Review",
  },
  DONE: {
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    text: "text-green-400",
    icon: CheckCircle,
    title: "Done",
  },
};

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-gray-900/80 border border-white/10 rounded-2xl shadow-xl w-full max-w-md relative p-6">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1.5 bg-gray-800/50 hover:bg-gray-700/50 rounded-full text-gray-400 hover:text-white transition-colors"
      >
        <X size={18} />
      </button>
      {children}
    </div>
  </div>
);

const AddEditModal = ({ todo, onClose, onSave }) => {
  const [task, setTask] = useState(todo ? todo.task : "");
  const [status, setStatus] = useState(todo ? todo.status : "TODO");
  const isEditing = !!todo;

  const handleSave = () => {
    if (!task.trim()) return;
    onSave({ task, status });
  };

  return (
    <Modal onClose={onClose}>
      <h3 className="text-xl font-bold text-white mb-4">
        {isEditing ? "Edit Task" : "Add New Task"}
      </h3>
      <div className="space-y-4">
        <textarea
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter task description..."
          className="w-full bg-gray-800/50 p-3 rounded-lg border border-gray-700 focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:outline-none transition-all text-gray-200"
          rows={3}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full bg-gray-800/50 p-3 rounded-lg border border-gray-700 focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:outline-none transition-all text-gray-200 appearance-none"
        >
          {Object.keys(COLUMN_THEME).map((statusKey) => (
            <option key={statusKey} value={statusKey}>
              {COLUMN_THEME[statusKey].title}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold transition-colors"
          >
            {isEditing ? "Save Changes" : "Add Task"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

const DeleteModal = ({ onClose, onConfirm }) => (
  <Modal onClose={onClose}>
    <h3 className="text-xl font-bold text-white mb-2">Delete Task</h3>
    <p className="text-gray-400 mb-6">
      Are you sure? This action cannot be undone.
    </p>
    <div className="flex justify-end gap-3">
      <button
        onClick={onClose}
        className="px-4 py-2 text-gray-400 hover:text-white"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
      >
        Delete
      </button>
    </div>
  </Modal>
);

const DevBoardPage = () => {
  const dispatch = useDispatch();
  const { todos, status } = useSelector((state) => state.todos);

  const [viewMode, setViewMode] = useState("today");

  const [modal, setModal] = useState(null);
  const [selectedTodo, setSelectedTodo] = useState(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTodos());
    }
  }, [status, dispatch]);

  const filteredTodos = useMemo(() => {
    if (viewMode === "all") {
      return todos;
    }
    const todayString = new Date().toDateString();
    return todos.filter(
      (todo) => new Date(todo.createdAt).toDateString() === todayString
    );
  }, [todos, viewMode]);

  const columns = useMemo(() => {
    return filteredTodos.reduce(
      (acc, todo) => {
        if (acc[todo.status]) {
          acc[todo.status].push(todo);
        }
        return acc;
      },
      { TODO: [], IN_PROGRESS: [], IN_REVIEW: [], DONE: [] }
    );
  }, [filteredTodos]);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }
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

  const handleSaveTodo = (data) => {
    if (modal === "edit" && selectedTodo) {
      dispatch(updateTodo({ todoId: selectedTodo._id, updateData: data }));
    } else {
      dispatch(createTodo({ ...data, isCompleted: data.status === "DONE" }));
    }
    setModal(null);
    setSelectedTodo(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedTodo) {
      dispatch(deleteTodo(selectedTodo._id));
    }
    setModal(null);
    setSelectedTodo(null);
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-400"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <ListTodo size={28} /> Dev Board
          </h1>
          <p className="text-gray-400">Drag & drop to organize your tasks.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-gray-800/50 rounded-lg p-1">
            <button
              onClick={() => setViewMode("today")}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                viewMode === "today"
                  ? "bg-gray-900 text-violet-400 shadow-md"
                  : "text-gray-400"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setViewMode("all")}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                viewMode === "all"
                  ? "bg-gray-900 text-violet-400 shadow-md"
                  : "text-gray-400"
              }`}
            >
              All Tasks
            </button>
          </div>
          <button
            onClick={() => setModal("add")}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            <Plus size={18} /> Add Task
          </button>
        </div>
      </header>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-y-auto">
          {Object.entries(columns).map(([columnId, tasks]) => {
            const theme = COLUMN_THEME[columnId];
            return (
              <div
                key={columnId}
                className={`flex flex-col ${theme.bg} rounded-xl border ${theme.border}`}
              >
                <div
                  className={`flex items-center gap-3 p-4 border-b ${theme.border}`}
                >
                  <theme.icon className={`w-5 h-5 ${theme.text}`} />
                  <h2 className="text-lg font-semibold text-white">
                    {theme.title}
                  </h2>
                  <span
                    className={`ml-auto text-sm font-medium ${theme.text} bg-black/20 px-2 py-0.5 rounded-full`}
                  >
                    {tasks.length}
                  </span>
                </div>
                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-3 space-y-3 transition-colors ${
                        snapshot.isDraggingOver ? "bg-black/20" : ""
                      }`}
                    >
                      {tasks.map((todo, index) => (
                        <Draggable
                          key={todo._id}
                          draggableId={todo._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`group p-3 rounded-lg bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm transition-all duration-200 ${
                                snapshot.isDragging
                                  ? "ring-2 ring-violet-500 shadow-lg"
                                  : "hover:bg-gray-800/50"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  {...provided.dragHandleProps}
                                  className="p-1 mt-0.5 text-gray-500 hover:text-white cursor-grab active:cursor-grabbing"
                                >
                                  <GripVertical size={16} />
                                </div>
                                <div className="flex-1">
                                  <p className="text-gray-200 font-medium">
                                    {todo.task}
                                  </p>
                                  <div className="flex items-center justify-between mt-3">
                                    <p className="text-xs text-gray-500">
                                      {new Date(
                                        todo.createdAt
                                      ).toLocaleDateString()}
                                    </p>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button
                                        onClick={() => {
                                          setSelectedTodo(todo);
                                          setModal("edit");
                                        }}
                                        className="p-1 text-gray-400 hover:text-white rounded hover:bg-gray-700/50"
                                      >
                                        <Edit2 size={14} />
                                      </button>
                                      <button
                                        onClick={() => {
                                          setSelectedTodo(todo);
                                          setModal("delete");
                                        }}
                                        className="p-1 text-gray-400 hover:text-red-500 rounded hover:bg-gray-700/50"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {modal === "add" && (
        <AddEditModal onClose={() => setModal(null)} onSave={handleSaveTodo} />
      )}
      {modal === "edit" && (
        <AddEditModal
          todo={selectedTodo}
          onClose={() => setModal(null)}
          onSave={handleSaveTodo}
        />
      )}
      {modal === "delete" && (
        <DeleteModal
          onClose={() => setModal(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default DevBoardPage;
