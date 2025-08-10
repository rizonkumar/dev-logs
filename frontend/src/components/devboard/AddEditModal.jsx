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
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        {isEditing ? "Edit Task" : "Add New Task"}
      </h3>
      <div className="space-y-4">
        <textarea
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter task description..."
          className="w-full bg-stone-50 dark:bg-stone-900 p-3 rounded-lg border border-stone-300 dark:border-stone-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all text-gray-800 dark:text-stone-100 placeholder-gray-400 dark:placeholder-stone-400"
          rows={3}
          autoFocus
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full bg-stone-50 dark:bg-stone-900 p-3 rounded-lg border border-stone-300 dark:border-stone-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all text-gray-800 dark:text-stone-100 appearance-none"
        >
          {Object.keys(COLUMN_THEME).map((statusKey) => (
            <option key={statusKey} value={statusKey}>
              {COLUMN_THEME[statusKey].title}
            </option>
          ))}
        </select>
        <TagInput selectedTags={tags} onTagsChange={setTags} />
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 text-gray-800 dark:text-stone-900 bg-white dark:bg-stone-200 hover:bg-stone-100 dark:hover:bg-stone-100 border border-stone-300 dark:border-stone-300 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-gray-800 hover:bg-black text-white rounded-lg font-semibold transition-colors cursor-pointer dark:bg-stone-900 dark:hover:bg-black"
          >
            {isEditing ? "Save Changes" : "Add Task"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddEditModal;
