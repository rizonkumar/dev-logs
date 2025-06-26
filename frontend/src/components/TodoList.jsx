import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../app/features/todosSlice";
import { Plus, Trash2, Edit, Check, X, Loader2 } from "lucide-react";

const TodoItem = ({ todo }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.task);
  const [itemStatus, setItemStatus] = useState("idle");

  const handleUpdate = async () => {
    if (editText.trim() === "") return;
    setItemStatus("loading");
    await dispatch(
      updateTodo({ todoId: todo._id, updateData: { task: editText } })
    );
    setIsEditing(false);
    setItemStatus("idle");
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
  };

  return (
    <li className="flex items-center justify-between p-3 transition-colors duration-200 rounded-lg hover:bg-gray-800/50">
      {isEditing ? (
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

  // THIS IS THE CRUCIAL PART FOR PERSISTENCE
  // This useEffect hook runs once when the component first mounts.
  useEffect(() => {
    // We check the status. If it's 'idle', it means we haven't fetched data yet.
    if (status === "idle") {
      console.log("Fetching todos from the backend...");
      // We dispatch the action to fetch all todos from our API.
      dispatch(fetchTodos());
    }
  }, [status, dispatch]); // It depends on 'status' and 'dispatch'.

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (newTask.trim() === "") return;
    await dispatch(createTodo({ task: newTask }));
    setNewTask("");
  };

  let listContent;

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
