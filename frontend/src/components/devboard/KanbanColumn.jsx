import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, Edit2, Trash2 } from "lucide-react";

const KanbanColumn = ({
  columnId,
  tasks,
  theme,
  openEditModal,
  openDeleteModal,
}) => {
  const Icon = theme.icon;
  return (
    <div className="flex flex-col bg-stone-100 dark:bg-stone-900 rounded-xl min-w-[280px] border border-transparent dark:border-stone-700">
      <div
        className={`flex items-center gap-3 p-4 border-t-4 ${theme.headerClasses}`}
      >
        <Icon className={`w-5 h-5 ${theme.iconClasses}`} />
        <h2 className="text-lg font-bold dark:text-white">{theme.title}</h2>
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
            className={`flex-1 p-3 space-y-3 transition-colors rounded-b-xl ${
              snapshot.isDraggingOver
                ? "bg-stone-200/70 dark:bg-stone-800/60"
                : ""
            }`}
          >
            {tasks.map((todo, index) => (
              <Draggable key={todo._id} draggableId={todo._id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="group relative p-3 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-sm hover:shadow-md hover:border-stone-300 dark:hover:border-stone-600 transition-all cursor-pointer"
                    onClick={(e) => openEditModal(e, todo)}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        {...provided.dragHandleProps}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 mt-0.5 text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 cursor-grab active:cursor-grabbing"
                      >
                        <GripVertical size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 dark:text-stone-100 font-medium text-sm">
                          {todo.task}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-xs text-stone-500 dark:text-stone-400">
                            {new Date(todo.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => openEditModal(e, todo)}
                              className="p-1 text-gray-500 dark:text-stone-300 hover:text-blue-600 rounded hover:bg-blue-100 dark:hover:bg-blue-950/30 cursor-pointer"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={(e) => openDeleteModal(e, todo)}
                              className="p-1 text-gray-500 dark:text-stone-300 hover:text-red-600 rounded hover:bg-red-100 dark:hover:bg-red-950/30 cursor-pointer"
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
};

export default KanbanColumn;
