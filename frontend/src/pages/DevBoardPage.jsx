import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext } from "@hello-pangea/dnd";
import {
  fetchTodos,
  updateTodo,
  deleteTodo,
  createTodo,
} from "../app/features/todosSlice";
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import KanbanSkeleton from "../components/devboard/KanbanSkeleton";
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
  const [tagsFilter, setTagsFilter] = useState([]);
  const searchRef = useRef(null);
  const liveRef = useRef(null);
  const announce = (message) => {
    if (liveRef.current) liveRef.current.textContent = message;
  };

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTodos());
    }
  }, [status, dispatch]);

  // persist view and filters to URL + localStorage
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (dateFrom) params.set("from", dateFrom);
    if (dateTo) params.set("to", dateTo);
    if (viewMode) params.set("view", viewMode);
    if (tagsFilter && tagsFilter.length > 0)
      params.set("tags", tagsFilter.join(","));
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", url);
    try {
      localStorage.setItem(
        "devboardState",
        JSON.stringify({
          q: searchQuery,
          from: dateFrom,
          to: dateTo,
          view: viewMode,
          tags: tagsFilter,
        })
      );
    } catch {}
  }, [searchQuery, dateFrom, dateTo, viewMode, tagsFilter]);

  useEffect(() => {
    // hydrate on mount
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const saved =
        JSON.parse(localStorage.getItem("devboardState") || "null") || {};
      setSearchQuery(searchParams.get("q") ?? saved.q ?? "");
      setDateFrom(searchParams.get("from") ?? saved.from ?? "");
      setDateTo(searchParams.get("to") ?? saved.to ?? "");
      setViewMode(searchParams.get("view") ?? saved.view ?? "today");
      const tagsFromQuery = searchParams.get("tags");
      if (tagsFromQuery) {
        setTagsFilter(
          tagsFromQuery
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        );
      } else if (Array.isArray(saved.tags)) {
        setTagsFilter(saved.tags.filter((t) => typeof t === "string"));
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if (tagsFilter && tagsFilter.length > 0) params.tags = tagsFilter.join(",");
    if (Object.keys(params).length > 0) {
      dispatch(fetchTodos(params));
    } else {
      // When all filters are cleared, refetch the full list so UI restores Today view properly
      dispatch(fetchTodos());
    }
  }, [debouncedSearch, dateFrom, dateTo, tagsFilter, dispatch]);

  const clearFilters = () => {
    setSearchQuery("");
    setDateFrom("");
    setDateTo("");
    setTagsFilter([]);
    dispatch(fetchTodos());
  };

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (
        e.target &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)
      )
        return;
      if (e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key.toLowerCase() === "a") {
        e.preventDefault();
        setModal("add");
      } else if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        clearFilters();
      } else if (e.key === "1") {
        setViewMode("today");
      } else if (e.key === "2") {
        setViewMode("all");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [clearFilters]);

  const filteredTodos = useMemo(() => {
    const hasServerFilters = Boolean(
      debouncedSearch || dateFrom || dateTo || (tagsFilter && tagsFilter.length)
    );
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
  }, [todos, viewMode, debouncedSearch, dateFrom, dateTo, tagsFilter]);

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

  const handleDragStart = () => {
    announce("Drag started");
  };

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
    announce(`Moved to ${destination.droppableId}`);
  };

  const handleSaveTodo = (data) => {
    const newTodoData = {
      task: data.task,
      status: data.status,
      isCompleted: data.status === "DONE",
      tags: Array.isArray(data.tags) ? data.tags : [],
    };
    if (modal === "edit" && selectedTodo) {
      dispatch(
        updateTodo({ todoId: selectedTodo._id, updateData: newTodoData })
      );
      toast.success("Task updated");
    } else {
      dispatch(createTodo(newTodoData));
      toast.success("Task added");
    }
    setModal(null);
    setSelectedTodo(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedTodo) {
      const removed = selectedTodo;
      dispatch(deleteTodo(selectedTodo._id));
      setModal(null);
      setSelectedTodo(null);
      const id = toast(
        () => (
          <div className="flex items-center gap-3">
            <span>Task deleted</span>
            <button
              onClick={() => {
                dispatch(
                  createTodo({
                    task: removed.task,
                    status: removed.status,
                    isCompleted: removed.isCompleted,
                    tags: Array.isArray(removed.tags) ? removed.tags : [],
                  })
                );
                toast.dismiss(id);
              }}
              className="px-2 py-0.5 text-sm rounded bg-stone-200 dark:bg-stone-800"
            >
              Undo
            </button>
          </div>
        ),
        { autoClose: 5000 }
      );
    }
  };

  const openEditModal = (e, todo) => {
    e.stopPropagation();
    setSelectedTodo(todo);
    setModal("edit");
    announce("Edit task dialog opened");
  };

  const openDeleteModal = (e, todo) => {
    e.stopPropagation();
    setSelectedTodo(todo);
    setModal("delete");
    announce("Delete task confirmation opened");
  };

  if (status === "loading") {
    return (
      <div className="h-full flex flex-col p-4 md:p-6 bg-stone-50 dark:bg-stone-950">
        <KanbanSkeleton />
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
        searchInputRef={searchRef}
        selectedTags={tagsFilter}
        setSelectedTags={setTagsFilter}
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
        <DragDropContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
           <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 overflow-x-auto" onDragOver={(e)=>{
             const edge=80;const x=e.clientX;const w=window.innerWidth; if(x<edge) window.scrollBy({left:-20,behavior:'smooth'}); else if(w-x<edge) window.scrollBy({left:20,behavior:'smooth'});
           }}>
            {Object.entries(columns).map(([columnId, tasks]) => (
              <KanbanColumn
                key={columnId}
                columnId={columnId}
                tasks={tasks}
                theme={COLUMN_THEME[columnId]}
                openEditModal={openEditModal}
                openDeleteModal={openDeleteModal}
                onQuickAdd={(task) => {
                  dispatch(
                    createTodo({ task, status: "TODO", isCompleted: false })
                  );
                  toast.success("Task added");
                }}
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
      <div aria-live="polite" className="sr-only" ref={liveRef} />
    </div>
  );
};

export default DevBoardPage;
