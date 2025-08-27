import React, { useState } from "react";
import Modal from "./Modal";
import { COLUMN_THEME } from "./columnTheme";
import TagInput from "../TagInput";

const AddEditModal = ({ todo, onClose, onSave }) => {
  const [task, setTask] = useState(todo ? todo.task : "");
  const [status, setStatus] = useState(todo ? todo.status : "TODO");
  const [tags, setTags] = useState(Array.isArray(todo?.tags) ? todo.tags : []);
  const isEditing = !!todo;

  const handleSave = () => {
    if (!task.trim()) return;
    onSave({ task, status, tags });
  };

  return (
    <Modal onClose={onClose}>
      <div className="space-y-6">
        <div className="text-center">
          <h3
            className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900
                         dark:from-stone-100 dark:via-stone-200 dark:to-stone-100 bg-clip-text text-transparent mb-2"
          >
            {isEditing ? "Edit Task" : "Create New Task"}
          </h3>
          <p className="text-stone-600 dark:text-stone-300 text-sm">
            {isEditing
              ? "Update your task details below"
              : "Add a new task to your board"}
          </p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Task Description
            </label>
            <textarea
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm p-4 rounded-xl
                         border border-stone-200/50 dark:border-stone-700/50 text-stone-900 dark:text-stone-100
                         placeholder-stone-500 dark:placeholder-stone-400 focus:outline-none focus:ring-2
                         focus:ring-blue-500/50 focus:border-blue-400 dark:focus:border-blue-500
                         transition-all duration-300 shadow-sm hover:shadow-md resize-none font-medium"
              rows={4}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm p-4 rounded-xl
                         border border-stone-200/50 dark:border-stone-700/50 text-stone-900 dark:text-stone-100
                         focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400
                         dark:focus:border-purple-500 transition-all duration-300 shadow-sm hover:shadow-md
                         font-medium appearance-none cursor-pointer"
            >
              {Object.keys(COLUMN_THEME).map((statusKey) => (
                <option
                  key={statusKey}
                  value={statusKey}
                  className="bg-white dark:bg-stone-900"
                >
                  {COLUMN_THEME[statusKey].title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Tags (Optional)
            </label>
            <TagInput selectedTags={tags} onTagsChange={setTags} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-stone-200/50 dark:border-stone-700/50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-stone-700 dark:text-stone-300 bg-stone-100/80 dark:bg-stone-800/80
                       hover:bg-stone-200/80 dark:hover:bg-stone-700/80 rounded-xl font-semibold
                       transition-all duration-300 cursor-pointer hover:scale-105 backdrop-blur-sm
                       border border-stone-200/50 dark:border-stone-700/50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600
                       text-white rounded-xl font-semibold transition-all duration-300 cursor-pointer
                       shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30
                       hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
                       disabled:hover:scale-100 disabled:hover:shadow-lg"
            disabled={!task.trim()}
          >
            {isEditing ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddEditModal;
