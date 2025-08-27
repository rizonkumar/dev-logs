import React from "react";
import Modal from "./Modal";
import { Trash2, AlertTriangle } from "lucide-react";

const DeleteModal = ({ onClose, onConfirm }) => (
  <Modal onClose={onClose}>
    <div className="text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-950/30 text-red-600 flex items-center justify-center rounded-2xl border border-red-200 dark:border-red-900/40">
        <Trash2 size={32} />
      </div>

      <div className="space-y-3">
        <h3
          className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-600 via-red-700 to-red-600
                       dark:from-red-400 dark:via-red-500 dark:to-red-400 bg-clip-text text-transparent"
        >
          Delete Task
        </h3>
        <p className="text-stone-600 dark:text-stone-300 text-base sm:text-lg leading-relaxed">
          This action cannot be undone. The task will be permanently removed
          from your board.
        </p>
      </div>

      <div className="bg-red-50/80 dark:bg-red-950/20 backdrop-blur-sm rounded-xl p-4 border border-red-200/50 dark:border-red-900/30">
        <div className="flex items-start gap-3">
          <AlertTriangle
            size={20}
            className="text-red-500 flex-shrink-0 mt-0.5"
          />
          <div className="text-left">
            <p className="text-red-800 dark:text-red-200 font-medium text-sm">
              Warning
            </p>
            <p className="text-red-700 dark:text-red-300 text-sm mt-1">
              Deleting this task will remove it from all views and cannot be
              recovered.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <button
          onClick={onClose}
          className="px-6 py-2.5 text-stone-700 dark:text-stone-300 bg-stone-100/80 dark:bg-stone-800/80
                     hover:bg-stone-200/80 dark:hover:bg-stone-700/80 rounded-xl font-semibold
                     transition-all duration-300 cursor-pointer hover:scale-105 backdrop-blur-sm
                     border border-stone-200/50 dark:border-stone-700/50"
        >
          Keep Task
        </button>
        <button
          onClick={onConfirm}
          className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700
                     text-white rounded-xl font-semibold transition-all duration-300 cursor-pointer
                     shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30
                     hover:scale-105 transform"
        >
          Delete Task
        </button>
      </div>
    </div>
  </Modal>
);

export default DeleteModal;
