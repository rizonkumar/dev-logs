import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext } from "@hello-pangea/dnd";
import {
  fetchTodos,
  updateTodo,
  deleteTodo,
  createTodo,
} from "../app/features/todosSlice";
import { Search } from "lucide-react";
import BoardHeader from "../components/devboard/BoardHeader";
import AddEditModal from "../components/devboard/AddEditModal";
import DeleteModal from "../components/devboard/DeleteModal";
import EmptyState from "../components/devboard/EmptyState";
import KanbanColumn from "../components/devboard/KanbanColumn";
import { COLUMN_THEME } from "../components/devboard/columnTheme";

const DevBoardPage = () => {
  const dispatch = useDispatch();
  const { todos, status } = useSelector((state) => state.todos);
  const [viewMode, setViewMode] = useState("today");
  const [modal, setModal] = useState(null);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTodos());
    }
  }, [status, dispatch]);

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 400);
    return () => clearTimeout(handle);
  }, [searchQuery]);

  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.q = debouncedSearch;
    if (dateFrom) params.from = dateFrom;
    if (dateTo) params.to = dateTo;
    if (Object.keys(params).length > 0) {
      dispatch(fetchTodos(params));
    } else {
      // When all filters are cleared, refetch the full list so UI restores Today view properly
      dispatch(fetchTodos());
    }
  }, [debouncedSearch, dateFrom, dateTo, dispatch]);

  const clearFilters = () => {
    setSearchQuery("");
    setDateFrom("");
    setDateTo("");
    dispatch(fetchTodos());
  };

  const filteredTodos = useMemo(() => {
    const hasServerFilters = Boolean(debouncedSearch || dateFrom || dateTo);
    if (viewMode === "all" || hasServerFilters) return todos;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return todos.filter((todo) => {
      const createdAtDate = new Date(todo.createdAt);
      const isToday =
        createdAtDate.getFullYear() === today.getFullYear() &&
        createdAtDate.getMonth() === today.getMonth() &&
        createdAtDate.getDate() === today.getDate();

      const isActive = todo.status !== "DONE";
      return isToday || isActive;
    });
  }, [todos, viewMode, debouncedSearch, dateFrom, dateTo]);

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
    <div className="h-full flex flex-col p-4 md:p-6 bg-stone-50 dark:bg-stone-950">
      <BoardHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        clearFilters={clearFilters}
        onAddTask={() => setModal("add")}
      />

      {filteredTodos.length === 0 && status === "succeeded" ? (
        debouncedSearch || dateFrom || dateTo ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl max-w-lg w-full">
              <div className="mx-auto w-14 h-14 bg-blue-100 dark:bg-blue-950/30 text-blue-600 flex items-center justify-center rounded-2xl mb-4 border border-blue-200 dark:border-blue-900/40">
                <Search size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                No results
              </h2>
              <p className="text-sm text-stone-500 dark:text-stone-300">
                {debouncedSearch
                  ? `No tasks found for "${debouncedSearch}"`
                  : "No tasks found for the selected date range"}
              </p>
            </div>
          </div>
        ) : (
          <EmptyState onAddTaskClick={() => setModal("add")} />
        )
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 overflow-x-auto">
            {Object.entries(columns).map(([columnId, tasks]) => (
              <KanbanColumn
                key={columnId}
                columnId={columnId}
                tasks={tasks}
                theme={COLUMN_THEME[columnId]}
                openEditModal={openEditModal}
                openDeleteModal={openDeleteModal}
              />
            ))}
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
