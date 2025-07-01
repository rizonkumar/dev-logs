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
  MoreHorizontal,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const BOARD_THEME = {
  TODO: {
    bg: "bg-gradient-to-br from-blue-500/5 via-blue-500/2 to-transparent",
    hoverBg: "hover:bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    icon: Circle,
  },
  IN_PROGRESS: {
    bg: "bg-gradient-to-br from-amber-500/5 via-amber-500/2 to-transparent",
    hoverBg: "hover:bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    icon: Clock,
  },
  IN_REVIEW: {
    bg: "bg-gradient-to-br from-purple-500/5 via-purple-500/2 to-transparent",
    hoverBg: "hover:bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-400",
    icon: AlertCircle,
  },
  DONE: {
    bg: "bg-gradient-to-br from-emerald-500/5 via-emerald-500/2 to-transparent",
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

    const newColumns = filteredTodos.reduce(
      (acc, todo) => {
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

    dispatch(
      updateTodo({
        todoId: draggableId,
        updateData: {
          status: destination.droppableId,
          isCompleted: destination.droppableId === "DONE",
        },
      })
    ).then(() => {
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
    <div className="min-h-screen bg-[#0A0F1C]">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#151B2E]/90 via-[#151B2E]/50 to-transparent backdrop-blur-xl sticky top-0 z-10 border-b border-[#1F2B4E]">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-200 bg-[#1F2B4E]/50 hover:bg-[#2A3655] px-4 py-2 rounded-lg border border-[#2A3655] hover:border-[#3A476E]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                Development Board
                <span className="text-sm font-medium bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">
                  {totalTasks} tasks
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 bg-[#1F2B4E]/30 border border-[#2A3655] rounded-lg px-4 py-2 pl-10 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                />
                <Search className="w-4 h-4 text-gray-500 group-hover:text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors" />
              </div>
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
                  className={`flex flex-col bg-[#151B2E]/50 rounded-xl border border-[#1F2B4E] backdrop-blur-sm transition-all duration-200 group ${theme.bg}`}
                >
                  <div className="p-4 flex items-center justify-between border-b border-[#1F2B4E]">
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
                      <h3 className="font-medium text-white flex items-center gap-2">
                        {getColumnTitle(columnId)}
                        <span
                          className={`text-sm font-normal ${theme.text} bg-[#0A0F1C]/80 px-2 py-0.5 rounded-md border ${theme.border}`}
                        >
                          {columns[columnId].length}
                        </span>
                      </h3>
                    </div>
                    <button className="p-1 text-gray-400 hover:text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  <Droppable droppableId={columnId}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 p-4 space-y-3 min-h-[200px] transition-colors duration-200 relative ${
                          snapshot.isDraggingOver ? "bg-[#1F2B4E]/30" : ""
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
                                style={{
                                  ...provided.draggableProps.style,
                                  position: snapshot.isDragging
                                    ? "absolute"
                                    : "relative",
                                }}
                                className={`group bg-[#1A2236] rounded-lg border border-[#2A3655] hover:border-[#3A476E] ${
                                  theme.hoverBg
                                } transition-all duration-200 ${
                                  snapshot.isDragging
                                    ? "shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/20 rotate-2 scale-105 z-50"
                                    : ""
                                }`}
                              >
                                <div className="p-3">
                                  <div className="flex items-start gap-2">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="mt-1 p-1 rounded hover:bg-[#2A3655] cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
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
                          <div
                            className={
                              columns[columnId].length === 0 ? "" : "mt-3"
                            }
                          >
                            {showAddCard ? (
                              <form
                                onSubmit={handleAddTask}
                                className="bg-[#1A2236] rounded-lg border border-[#2A3655] p-3"
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
                                    className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    disabled={!newTaskText.trim()}
                                    className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                    Add
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <button
                                onClick={() => setShowAddCard(true)}
                                className="w-full p-2 flex items-center gap-2 text-gray-400 hover:text-white bg-[#1A2236]/50 hover:bg-[#1A2236] rounded-lg border border-dashed border-[#2A3655] hover:border-[#3A476E] transition-all duration-200"
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
