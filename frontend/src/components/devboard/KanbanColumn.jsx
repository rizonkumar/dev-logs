import React, { useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, Edit2, Trash2 } from "lucide-react";
import { Virtuoso } from "react-virtuoso";

const KanbanColumn = ({
  columnId,
  tasks,
  theme,
  openEditModal,
  openDeleteModal,
  onQuickAdd,
}) => {
  const Icon = theme.icon;
  const [draft, setDraft] = useState("");
  const showQuickAdd = columnId === "TODO";
  return (
    <div
      className="flex flex-col bg-white/60 dark:bg-stone-900/60 backdrop-blur-xl rounded-2xl min-w-[280px] sm:min-w-[300px] lg:min-w-[320px]
                    border border-stone-200/50 dark:border-stone-700/50 shadow-xl shadow-stone-900/5 dark:shadow-stone-100/5
                    hover:shadow-2xl hover:shadow-stone-900/10 dark:hover:shadow-stone-100/10 transition-all duration-300
                    h-[calc(100vh-250px)] min-h-[400px] max-h-[70vh]"
    >
      <div
        className={`flex items-center gap-3 p-4 sm:p-5 border-t-4 ${theme.headerClasses} rounded-t-2xl backdrop-blur-sm`}
      >
        <div className="p-2 bg-white/40 dark:bg-white/20 rounded-lg backdrop-blur-sm border border-white/30 dark:border-white/20 shadow-sm">
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${theme.iconClasses}`} />
        </div>
        <h2 className="text-lg sm:text-xl font-bold flex-1">{theme.title}</h2>
        <span
          className={`text-sm font-bold ${theme.badgeClasses} px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm`}
        >
          {tasks.length}
        </span>
      </div>
      {showQuickAdd && (
        <div className="px-4 pb-3">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && draft.trim()) {
                onQuickAdd?.(draft.trim());
                setDraft("");
              }
            }}
            placeholder="Quick add task and press Enter"
            className="w-full px-4 py-2.5 rounded-xl bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm
                       border border-stone-200/50 dark:border-stone-700/50 text-stone-900 dark:text-stone-100
                       placeholder-stone-500 dark:placeholder-stone-400 focus:outline-none focus:ring-2
                       focus:ring-blue-500/50 focus:border-blue-400 dark:focus:border-blue-500
                       transition-all duration-300 shadow-sm hover:shadow-md text-sm font-medium"
          />
        </div>
      )}
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 sm:p-4 transition-all duration-500 ease-out rounded-b-2xl overflow-y-auto scrollbar-thin scrollbar-thumb-stone-300/50 scrollbar-track-transparent dark:scrollbar-thumb-stone-600/50 ${
              snapshot.isDraggingOver
                ? "bg-gradient-to-br from-blue-500/15 to-purple-500/15 dark:from-blue-500/25 dark:to-purple-500/25 shadow-inner ring-2 ring-blue-500/20 dark:ring-blue-400/30"
                : "bg-stone-50/30 dark:bg-stone-950/30"
            }`}
          >
            <Virtuoso
              style={{ height: "100%" }}
              totalCount={tasks.length}
              itemContent={(index) => {
                const todo = tasks[index];
                return (
                  <Draggable
                    key={todo._id}
                    draggableId={todo._id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="group relative p-4 rounded-xl bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl
                                   border border-stone-200/60 dark:border-stone-700/60 shadow-lg shadow-stone-900/8
                                   dark:shadow-stone-100/8 transition-all duration-300 ease-out
                                   cursor-pointer mb-3 sm:mb-4 touch-manipulation select-none"
                        onClick={(e) => openEditModal(e, todo)}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            {...provided.dragHandleProps}
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 mt-0.5 text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300
                                       hover:bg-stone-100/60 dark:hover:bg-stone-800/60 rounded-lg transition-all duration-200
                                       cursor-grab active:cursor-grabbing group-hover:text-stone-500 dark:group-hover:text-stone-400
                                       touch-manipulation active:scale-95"
                          >
                            <GripVertical
                              size={16}
                              className="transition-transform duration-200 group-active:scale-110"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-stone-900 dark:text-stone-100 font-semibold text-sm sm:text-base leading-relaxed">
                              {todo.task}
                            </p>
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-200/50 dark:border-stone-700/50">
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                                  {new Date(todo.createdAt).toLocaleDateString(
                                    "en-US",
                                    { month: "short", day: "numeric" }
                                  )}
                                </p>
                                {Array.isArray(todo.tags) &&
                                  todo.tags.length > 0 && (
                                    <div className="hidden sm:flex flex-wrap gap-1">
                                      {todo.tags.slice(0, 2).map((tag) => (
                                        <span
                                          key={tag}
                                          className="px-2 py-0.5 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10
                                                     dark:from-blue-500/20 dark:to-purple-500/20 border border-blue-200/30
                                                     dark:border-blue-800/30 text-[10px] text-blue-700 dark:text-blue-300
                                                     font-medium backdrop-blur-sm"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                      {todo.tags.length > 2 && (
                                        <span
                                          className="px-2 py-0.5 rounded-lg bg-stone-100/80 dark:bg-stone-800/80
                                                       border border-stone-200/50 dark:border-stone-700/50 text-[10px]
                                                       text-stone-600 dark:text-stone-300 font-medium backdrop-blur-sm"
                                        >
                                          +{todo.tags.length - 2}
                                        </span>
                                      )}
                                    </div>
                                  )}
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <button
                                  onClick={(e) => openEditModal(e, todo)}
                                  className="p-2 text-stone-400 dark:text-stone-500 rounded-lg transition-all duration-200
                                             cursor-pointer"
                                  title="Edit task"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={(e) => openDeleteModal(e, todo)}
                                  className="p-2 text-stone-400 dark:text-stone-500 rounded-lg transition-all duration-200
                                             cursor-pointer"
                                  title="Delete task"
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
                );
              }}
              components={{ Footer: () => <div style={{ height: 4 }} /> }}
            />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
