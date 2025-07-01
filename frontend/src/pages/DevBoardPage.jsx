import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { fetchTodos, updateTodo } from "../app/features/todosSlice";
import {
  Circle,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  GripHorizontal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const COLUMN_COLORS = {
  TODO: {
    bg: "from-blue-500/10 to-blue-600/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
  },
  IN_PROGRESS: {
    bg: "from-yellow-500/10 to-orange-500/10",
    border: "border-yellow-500/20",
    text: "text-yellow-400",
  },
  IN_REVIEW: {
    bg: "from-purple-500/10 to-pink-500/10",
    border: "border-purple-500/20",
    text: "text-purple-400",
  },
  DONE: {
    bg: "from-green-500/10 to-emerald-500/10",
    border: "border-green-500/20",
    text: "text-green-400",
  },
};

const COLUMN_ICONS = {
  TODO: Circle,
  IN_PROGRESS: Clock,
  IN_REVIEW: AlertCircle,
  DONE: CheckCircle,
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

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTodos());
    }
  }, [status, dispatch]);

  useEffect(() => {
    const newColumns = todos.reduce(
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
  }, [todos]);

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

    // Update the todo's status in the backend
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
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(columns).map(([status, tasks]) => {
            const colors = COLUMN_COLORS[status];
            return (
              <div
                key={status}
                className={`bg-gradient-to-br ${colors.bg} rounded-xl border ${colors.border} p-4`}
              >
                <div className="flex items-center justify-between">
                  <h3 className={`${colors.text} font-medium`}>
                    {getColumnTitle(status)}
                  </h3>
                  <span
                    className={`${colors.text} text-sm bg-gray-900/30 px-2 py-0.5 rounded-full`}
                  >
                    {tasks.length} tasks
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Object.keys(columns).map((columnId) => {
            const Icon = COLUMN_ICONS[columnId];
            const colors = COLUMN_COLORS[columnId];
            return (
              <div
                key={columnId}
                className={`bg-gradient-to-br ${colors.bg} rounded-xl border ${colors.border} p-4`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className={`w-8 h-8 rounded-lg ${colors.bg} ${colors.border} flex items-center justify-center`}
                  >
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <h2 className="text-lg font-semibold text-white">
                    {getColumnTitle(columnId)}
                    <span
                      className={`ml-2 text-sm font-normal ${colors.text} bg-gray-900/30 px-2 py-0.5 rounded-full`}
                    >
                      {columns[columnId].length}
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
                                    <p className="text-gray-200 font-medium">
                                      {todo.task}
                                    </p>
                                    {todo.createdAt && (
                                      <div className="flex items-center gap-3 mt-2">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                          <Clock className="w-3.5 h-3.5" />
                                          <span>
                                            {new Date(
                                              todo.createdAt
                                            ).toLocaleDateString(undefined, {
                                              month: "short",
                                              day: "numeric",
                                              year: "numeric",
                                            })}
                                          </span>
                                        </div>
                                        <div
                                          className={`px-2 py-0.5 rounded text-xs ${colors.text} ${colors.bg} border ${colors.border}`}
                                        >
                                          {getColumnTitle(columnId)}
                                        </div>
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
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default DevBoardPage;
