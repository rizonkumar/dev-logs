import React from "react";
import { ClipboardList, Plus } from "lucide-react";

const EmptyState = ({ onAddTaskClick }) => (
  <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl p-10 max-w-lg shadow-sm">
      <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-950/30 text-blue-600 flex items-center justify-center rounded-2xl mb-6 border border-blue-200 dark:border-blue-900/40">
        <ClipboardList size={32} />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Your Board is Clear!
      </h2>
      <p className="text-gray-500 dark:text-stone-300 mb-6">
        Get started by adding your first task. Let's make today productive.
      </p>
      <button
        onClick={onAddTaskClick}
        className="flex items-center mx-auto gap-2 bg-gray-800 hover:bg-black dark:bg-stone-200 dark:hover:bg-white text-white dark:text-stone-900 px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
      >
        <Plus size={18} /> Add Your First Task
      </button>
    </div>
  </div>
);

export default EmptyState;
