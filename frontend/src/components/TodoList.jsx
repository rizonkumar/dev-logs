import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../app/features/todosSlice";
import { Plus, Trash2, Edit, Check, X, Loader2 } from "lucide-react"; // Import a different loader icon for inline use

// Sub-component for a single todo item
const TodoItem = ({ todo }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.task);
  // This state is local to each item and controls its specific loading spinner
  const [itemStatus, setItemStatus] = useState("idle");

  // These handlers are now async to allow us to manage the local loading state
  const handleUpdate = async () => {
    if (editText.trim() === "") return;
    setItemStatus("loading");
    // We 'await' the dispatch so we know when the API call is complete
    await dispatch(
      updateTodo({ todoId: todo._id, updateData: { task: editText } })
    );
    setIsEditing(false);
    setItemStatus("idle"); // Set status back to idle after completion
  };

  const handleToggle = async () => {
    setItemStatus("loading");
    await dispatch(
      updateTodo({
        todoId: todo._id,
        updateData: { isCompleted: !todo.isCompleted },
      })
    );
    setItemStatus("idle");
  };

  const handleDelete = async () => {
    setItemStatus("loading");
    await dispatch(deleteTodo(todo._id));
    // No need to set status back to idle, as the component will be removed from the list
  };

  return (
    <li className="flex items-center justify-between p-3 transition-colors duration-200 rounded-lg hover:bg-gray-800/50">
      {isEditing ? (
        // --- EDITING VIEW ---
        <div className="flex-grow flex items-center gap-2">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full bg-gray-900 px-2 py-1 rounded-md border border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-400"
            autoFocus
          />
          <button
            onClick={handleUpdate}
            className="p-2 text-white bg-teal-600 hover:bg-teal-500 rounded-md"
            title="Save"
          >
            <Check size={16} />
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md"
            title="Cancel"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        // --- NORMAL VIEW ---
        <>
          <div
            className="flex items-center flex-grow cursor-pointer"
            onClick={handleToggle}
          >
            <div
              className={`w-5 h-5 flex-shrink-0 mr-3 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                todo.isCompleted
                  ? "border-teal-500 bg-teal-500"
                  : "border-gray-500"
              }`}
            >
              {todo.isCompleted && (
                <Check size={14} className="text-gray-900" />
              )}
            </div>
            <span
              className={`transition-colors duration-200 ${
                todo.isCompleted
                  ? "text-gray-500 line-through"
                  : "text-gray-200"
              }`}
            >
              {todo.task}
            </span>
          </div>
          <div className="flex items-center space-x-1 ml-2">
            {/* Conditionally show the mini-loader or the action buttons */}
            {itemStatus === "loading" ? (
              <Loader2 size={16} className="animate-spin text-gray-500" />
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-500 hover:text-teal-400 rounded-md transition-colors"
                  title="Edit"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-gray-500 hover:text-red-400 rounded-md transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        </>
      )}
    </li>
  );
};

// Main TodoList Component
function TodoList() {
  const dispatch = useDispatch();
  const { todos, status, error } = useSelector((state) => state.todos);
  const [newTask, setNewTask] = useState("");

  // Fetch todos when the component mounts for the first time
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTodos());
    }
  }, [status, dispatch]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (newTask.trim() === "") return;
    await dispatch(createTodo({ task: newTask }));
    setNewTask("");
  };

  let listContent;

  // The main loader only shows on the very first fetch
  if (status === "loading" && todos.length === 0) {
    listContent = (
      <div className="text-center py-10 text-gray-400">Loading tasks...</div>
    );
  } else if (status === "failed") {
    listContent = <div className="text-center py-10 text-red-400">{error}</div>;
  } else if (status === "succeeded" && todos.length === 0) {
    listContent = (
      <div className="text-center py-10 text-gray-500">
        <p>You're all clear!</p>
        <p className="text-sm">Add a task to get started.</p>
      </div>
    );
  } else {
    listContent = (
      <ul className="space-y-1">
        {todos.map((todo) => (
          <TodoItem key={todo._id} todo={todo} />
        ))}
      </ul>
    );
  }

  return (
    <div className="bg-gray-800/80 p-6 rounded-2xl border border-gray-700/60 backdrop-blur-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-white mb-4">Daily TODOs</h3>

      <form onSubmit={handleAddTask} className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="w-full bg-gray-900/70 px-4 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-teal-400 focus:outline-none transition-all text-gray-300 placeholder-gray-500"
        />
        <button
          type="submit"
          className="bg-teal-500 hover:bg-teal-600 text-white font-semibold p-2 rounded-lg transition-colors duration-300 flex items-center justify-center flex-shrink-0 w-10 h-10"
          disabled={status === "loading"}
        >
          <Plus size={20} />
        </button>
      </form>

      <div className="flex-grow overflow-y-auto pr-2">{listContent}</div>
    </div>
  );
}

export default TodoList;
