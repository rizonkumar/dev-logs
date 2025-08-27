import React from "react";
import { X } from "lucide-react";

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-md flex items-center justify-center z-[60] p-3 sm:p-4 lg:p-6">
    <div
      className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border border-stone-200/50 dark:border-stone-700/50
                    rounded-2xl sm:rounded-3xl shadow-2xl shadow-stone-900/10 dark:shadow-stone-100/10
                    w-full max-w-md sm:max-w-lg relative p-4 sm:p-6 lg:p-8 transform animate-in fade-in-0 zoom-in-95 duration-300"
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-2 bg-stone-100/80 dark:bg-stone-800/80 hover:bg-stone-200/80
                   dark:hover:bg-stone-700/80 rounded-xl text-stone-600 dark:text-stone-300
                   hover:text-stone-900 dark:hover:text-stone-100 transition-all duration-200
                   hover:scale-110 backdrop-blur-sm border border-stone-200/50 dark:border-stone-700/50"
        aria-label="Close modal"
      >
        <X size={18} />
      </button>
      {children}
    </div>
  </div>
);

export default Modal;
