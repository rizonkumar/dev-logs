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
  ClipboardList,
} from "lucide-react";

const COLUMN_THEME = {
  TODO: {
    title: "To Do",
    icon: Circle,
    color: "blue",
    headerClasses: "border-blue-500 text-blue-700",
    iconClasses: "text-blue-500",
    badgeClasses: "bg-blue-100 text-blue-800",
  },
  IN_PROGRESS: {
    title: "In Progress",
    icon: Clock,
    color: "yellow",
    headerClasses: "border-yellow-500 text-yellow-700",
    iconClasses: "text-yellow-500",
    badgeClasses: "bg-yellow-100 text-yellow-800",
  },
  IN_REVIEW: {
    title: "In Review",
    icon: AlertCircle,
    color: "purple",
    headerClasses: "border-purple-500 text-purple-700",
    iconClasses: "text-purple-500",
    badgeClasses: "bg-purple-100 text-purple-800",
  },
  DONE: {
    title: "Done",
    icon: CheckCircle,
    color: "green",
    headerClasses: "border-green-500 text-green-700",
    iconClasses: "text-green-500",
    badgeClasses: "bg-green-100 text-green-800",
  },
};

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-gray-900/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white border border-stone-200 rounded-2xl shadow-xl w-full max-w-md relative p-6">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-1.5 bg-stone-100 hover:bg-stone-200 rounded-full text-gray-600 hover:text-gray-800 transition-colors"
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
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        {isEditing ? "Edit Task" : "Add New Task"}
      </h3>
      <div className="space-y-4">
        <textarea
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter task description..."
          className="w-full bg-stone-50 p-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all text-gray-800"
          rows={3}
          autoFocus
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full bg-stone-50 p-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all text-gray-800 appearance-none"
        >
          {Object.keys(COLUMN_THEME).map((statusKey) => (
            <option key={statusKey} value={statusKey}>
              {COLUMN_THEME[statusKey].title}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 text-gray-700 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-gray-800 hover:bg-black text-white rounded-lg font-semibold transition-colors"
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
    <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Task</h3>
    <p className="text-gray-500 mb-6">
      Are you sure? This action cannot be undone.
    </p>
    <div className="flex justify-end gap-3">
      <button
        onClick={onClose}
        className="px-5 py-2 text-gray-700 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg font-medium transition-colors"
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

const EmptyState = ({ onAddTaskClick }) => (
  <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
    <div className="bg-white border border-stone-200 rounded-2xl p-10 max-w-lg shadow-sm">
      <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 flex items-center justify-center rounded-2xl mb-6 border border-blue-200">
        <ClipboardList size={32} />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Your Board is Clear!
      </h2>
      <p className="text-gray-500 mb-6">
        Get started by adding your first task. Let's make today productive.
      </p>
      <button
        onClick={onAddTaskClick}
        className="flex items-center mx-auto gap-2 bg-gray-800 hover:bg-black text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
      >
        <Plus size={18} /> Add Your First Task
      </button>
    </div>
  </div>
);

const TaskCard = ({ todo, provided }) => (
  <div
    ref={provided.innerRef}
    {...provided.draggableProps}
    className="group p-3 rounded-lg bg-white border border-stone-200 shadow-sm hover:shadow-md hover:border-stone-300 transition-all"
  >
    <div className="flex items-start gap-2">
      <div
        {...provided.dragHandleProps}
        className="p-1 mt-0.5 text-stone-400 hover:text-stone-600 cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={16} />
      </div>
      <div className="flex-1">
        <p className="text-gray-800 font-medium text-sm">{todo.task}</p>
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-stone-500">
            {new Date(todo.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  </div>
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
    if (viewMode === "all") return todos;
    const todayString = new Date().toDateString();
    return todos.filter(
      (todo) => new Date(todo.createdAt).toDateString() === todayString
    );
  }, [todos, viewMode]);

  const columns = useMemo(() => {
    const initialColumns = {
      TODO: [],
      IN_PROGRESS: [],
      IN_REVIEW: [],
      DONE: [],
    };
    return filteredTodos.reduce((acc, todo) => {
      if (acc[todo.status]) {
        acc[todo.status].push(todo);
      }
      return acc;
    }, initialColumns);
  }, [filteredTodos]);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    )
      return;
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
    const newTodoData = {
      task: data.task,
      status: data.status,
      isCompleted: data.status === "DONE",
    };
    if (modal === "edit" && selectedTodo) {
      dispatch(
        updateTodo({ todoId: selectedTodo._id, updateData: newTodoData })
      );
    } else {
      dispatch(createTodo(newTodoData));
    }
    setModal(null);
    setSelectedTodo(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedTodo) dispatch(deleteTodo(selectedTodo._id));
    setModal(null);
    setSelectedTodo(null);
  };

  const openEditModal = (e, todo) => {
    e.stopPropagation();
    setSelectedTodo(todo);
    setModal("edit");
  };

  const openDeleteModal = (e, todo) => {
    e.stopPropagation();
    setSelectedTodo(todo);
    setModal("delete");
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-full p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4 md:p-6 bg-stone-50">
      <header className="mb-6 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ListTodo size={28} /> Dev Board
          </h1>
          <p className="text-gray-500">Drag & drop to organize your tasks.</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center bg-stone-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode("today")}
              className={`px-3 py-1 rounded-md text-sm font-semibold transition-all ${
                viewMode === "today"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setViewMode("all")}
              className={`px-3 py-1 rounded-md text-sm font-semibold transition-all ${
                viewMode === "all"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              All Tasks
            </button>
          </div>
          <button
            onClick={() => setModal("add")}
            className="flex items-center gap-2 bg-gray-800 hover:bg-black text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
          >
            <Plus size={18} /> Add Task
          </button>
        </div>
      </header>

      {filteredTodos.length === 0 && status === "succeeded" ? (
        <EmptyState onAddTaskClick={() => setModal("add")} />
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 overflow-x-auto">
            {Object.entries(columns).map(([columnId, tasks]) => {
              const theme = COLUMN_THEME[columnId];
              const Icon = theme.icon;
              return (
                <div
                  key={columnId}
                  className="flex flex-col bg-stone-100 rounded-xl min-w-[280px]"
                >
                  <div
                    className={`flex items-center gap-3 p-4 border-t-4 ${theme.headerClasses}`}
                  >
                    <Icon className={`w-5 h-5 ${theme.iconClasses}`} />
                    <h2 className="text-lg font-bold">{theme.title}</h2>
                    <span
                      className={`ml-auto text-sm font-bold ${theme.badgeClasses} px-2.5 py-0.5 rounded-full`}
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
                          snapshot.isDraggingOver ? "bg-stone-200/70" : ""
                        }`}
                      >
                        {tasks.map((todo, index) => (
                          <Draggable
                            key={todo._id}
                            draggableId={todo._id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="group relative p-3 rounded-lg bg-white border border-stone-200 shadow-sm hover:shadow-md hover:border-stone-300 transition-all cursor-pointer"
                                onClick={(e) => openEditModal(e, todo)}
                              >
                                <div className="flex items-start gap-2">
                                  <div
                                    {...provided.dragHandleProps}
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-1 mt-0.5 text-stone-400 hover:text-stone-600 cursor-grab active:cursor-grabbing"
                                  >
                                    <GripVertical size={16} />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-gray-800 font-medium text-sm">
                                      {todo.task}
                                    </p>
                                    <div className="flex items-center justify-between mt-3">
                                      <p className="text-xs text-stone-500">
                                        {new Date(
                                          todo.createdAt
                                        ).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                        })}
                                      </p>
                                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                          onClick={(e) =>
                                            openEditModal(e, todo)
                                          }
                                          className="p-1 text-gray-500 hover:text-blue-600 rounded hover:bg-blue-100"
                                        >
                                          <Edit2 size={14} />
                                        </button>
                                        <button
                                          onClick={(e) =>
                                            openDeleteModal(e, todo)
                                          }
                                          className="p-1 text-gray-500 hover:text-red-600 rounded hover:bg-red-100"
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
      )}

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
