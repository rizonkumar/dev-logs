import React from "react";
import Modal from "./Modal";

const DeleteModal = ({ onClose, onConfirm }) => (
  <Modal onClose={onClose}>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
      Delete Task
    </h3>
    <p className="text-gray-500 dark:text-stone-300 mb-6">
      Are you sure? This action cannot be undone.
    </p>
    <div className="flex justify-end gap-3">
      <button
        onClick={onClose}
        className="px-5 py-2 text-gray-800 dark:text-stone-900 bg-white dark:bg-stone-200 hover:bg-stone-100 dark:hover:bg-stone-100 border border-stone-300 dark:border-stone-300 rounded-lg font-semibold transition-colors cursor-pointer"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors cursor-pointer"
      >
        Delete
      </button>
    </div>
  </Modal>
);

export default DeleteModal;
