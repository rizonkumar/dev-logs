import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { fetchTodos, updateTodo, createTodo } from "../app/features/todosSlice";
import {
  Circle,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  GripHorizontal,
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const BOARD_THEME = {
  TODO: {
    bg: "from-blue-500/5 to-blue-600/5",
    hoverBg: "hover:bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    icon: Circle,
  },
  IN_PROGRESS: {
    bg: "from-amber-500/5 to-amber-600/5",
    hoverBg: "hover:bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    icon: Clock,
  },
  IN_REVIEW: {
    bg: "from-purple-500/5 to-purple-600/5",
    hoverBg: "hover:bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-400",
    icon: AlertCircle,
  },
  DONE: {
    bg: "from-emerald-500/5 to-emerald-600/5",
    hoverBg: "hover:bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    icon: CheckCircle,
  },
};

const EnhancedDevBoard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { todos, status } = useSelector((state) => state.todos);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddCard, setShowAddCard] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [columns, setColumns] = useState({
    TODO: [],
    IN_PROGRESS: [],
    IN_REVIEW: [],
    DONE: [],
  });

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTodos());
    }
  }, [status, dispatch]);

  useEffect(() => {
    const filteredTodos = todos.filter((todo) =>
      todo.task.toLowerCase().includes(searchTerm.toLowerCase())
    );

    console.log("Filtered todos:", filteredTodos);

    const newColumns = filteredTodos.reduce(
      (acc, todo) => {
        // Normalize the status to ensure it's one of our valid statuses
        const normalizedStatus = [
          "TODO",
          "IN_PROGRESS",
          "IN_REVIEW",
          "DONE",
        ].includes(todo.status)
          ? todo.status
          : "TODO";

        if (!acc[normalizedStatus]) {
          acc[normalizedStatus] = [];
        }
        acc[normalizedStatus].push({ ...todo, status: normalizedStatus });
        return acc;
      },
      {
        TODO: [],
        IN_PROGRESS: [],
        IN_REVIEW: [],
        DONE: [],
      }
    );

    console.log("New columns:", newColumns);
    setColumns(newColumns);
  }, [todos, searchTerm]);

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

    // Update the todo in the backend
    dispatch(
      updateTodo({
        todoId: draggableId,
        updateData: {
          status: destination.droppableId,
          isCompleted: destination.droppableId === "DONE",
        },
      })
    ).then(() => {
      // Refetch todos to ensure sync
      dispatch(fetchTodos());
    });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    await dispatch(createTodo({ task: newTaskText }));
    setNewTaskText("");
    setShowAddCard(false);
  };

  const getColumnTitle = (columnId) => {
    switch (columnId) {
      case "TODO":
        return "To Do";
      case "IN_PROGRESS":
        return "In Progress";
      case "IN_REVIEW":
        return "In Review";
      case "DONE":
        return "Done";
      default:
        return columnId;
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
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

  const totalTasks = Object.values(columns).reduce(
    (sum, tasks) => sum + tasks.length,
    0
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-800/50 via-gray-800/25 to-transparent backdrop-blur-sm sticky top-0 z-10 border-b border-gray-700/50">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg border border-gray-600 hover:border-gray-500"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                Development Board
                <span className="text-sm font-normal bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
                  {totalTasks} tasks
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pl-10 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                />
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <button className="p-2 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 py-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Object.keys(columns).map((columnId) => {
              const theme = BOARD_THEME[columnId];
              if (!theme) {
                console.error(`Theme not found for column: ${columnId}`);
                return null;
              }
              return (
                <div
                  key={columnId}
                  className="flex flex-col bg-gray-800/50 rounded-xl border border-gray-700/50"
                >
                  <div className="p-3 flex items-center justify-between border-b border-gray-700/50">
                    <div className="flex items-center gap-2">
                      {columnId === "TODO" && theme && (
                        <Circle className={`w-4 h-4 ${theme.text}`} />
                      )}
                      {columnId === "IN_PROGRESS" && theme && (
                        <Clock className={`w-4 h-4 ${theme.text}`} />
                      )}
                      {columnId === "IN_REVIEW" && theme && (
                        <AlertCircle className={`w-4 h-4 ${theme.text}`} />
                      )}
                      {columnId === "DONE" && theme && (
                        <CheckCircle className={`w-4 h-4 ${theme.text}`} />
                      )}
                      <h3 className="font-medium text-white">
                        {getColumnTitle(columnId)}
                        <span className="ml-2 text-sm font-normal text-gray-400">
                          {columns[columnId].length}
                        </span>
                      </h3>
                    </div>
                    <button className="p-1 text-gray-400 hover:text-white rounded">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  <Droppable droppableId={columnId}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 p-3 space-y-3 min-h-[150px] ${
                          snapshot.isDraggingOver ? "bg-gray-800/50" : ""
                        }`}
                      >
                        {columns[columnId].map((todo, index) => (
                          <Draggable
                            key={todo._id}
                            draggableId={todo._id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`group bg-gray-900 rounded-lg border border-gray-700/50 ${
                                  theme.hoverBg
                                } transition-all duration-200 ${
                                  snapshot.isDragging
                                    ? "shadow-lg ring-2 ring-blue-500/50 rotate-2"
                                    : ""
                                }`}
                              >
                                <div className="p-3">
                                  <div className="flex items-start gap-2">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="mt-1 p-1 rounded hover:bg-gray-800 cursor-grab active:cursor-grabbing"
                                    >
                                      <GripHorizontal className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-gray-200 font-medium">
                                        {todo.task}
                                      </p>
                                      {todo.createdAt && (
                                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                          <Calendar className="w-3.5 h-3.5" />
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
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}

                        {columnId === "TODO" && (
                          <div>
                            {showAddCard ? (
                              <form
                                onSubmit={handleAddTask}
                                className="bg-gray-900 rounded-lg border border-gray-700/50 p-3"
                              >
                                <textarea
                                  value={newTaskText}
                                  onChange={(e) =>
                                    setNewTaskText(e.target.value)
                                  }
                                  placeholder="What needs to be done?"
                                  className="w-full bg-transparent border-0 focus:ring-0 text-gray-300 placeholder-gray-500 resize-none"
                                  rows={2}
                                  autoFocus
                                />
                                <div className="flex items-center justify-end gap-2 mt-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setShowAddCard(false);
                                      setNewTaskText("");
                                    }}
                                    className="px-3 py-1 text-sm text-gray-400 hover:text-white"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    disabled={!newTaskText.trim()}
                                    className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Add
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <button
                                onClick={() => setShowAddCard(true)}
                                className="w-full p-2 flex items-center gap-2 text-gray-400 hover:text-white bg-gray-900/50 hover:bg-gray-900 rounded-lg border border-dashed border-gray-700 hover:border-gray-600 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                                <span>Add task</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default EnhancedDevBoard;
