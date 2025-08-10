import React from "react";
import { X } from "lucide-react";

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-gray-900/10 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl shadow-xl w-full max-w-md relative p-6">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-full text-gray-600 dark:text-stone-300 hover:text-gray-800 dark:hover:text-white transition-colors"
      >
        <X size={18} />
      </button>
      {children}
    </div>
  </div>
);

export default Modal;
