import React from "react";
import { AlertTriangle } from "lucide-react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md flex justify-center items-center z-50
                    transition-all duration-300 p-4 animate-in fade-in zoom-in-95"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl rounded-2xl shadow-2xl
                    p-6 w-full max-w-md mx-4 border border-stone-200/50 dark:border-stone-700/50
                    shadow-stone-900/10 dark:shadow-stone-100/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-shrink-0">
            <div
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-100 to-red-200 dark:from-red-950/40 dark:to-red-900/40
                          flex items-center justify-center border border-red-200/50 dark:border-red-800/50 shadow-lg shadow-red-500/20"
            >
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>

          <div className="flex-grow">
            <h3
              className="text-xl font-bold bg-gradient-to-r from-stone-900 to-stone-700 dark:from-stone-100 dark:to-stone-300
                          bg-clip-text text-transparent mb-2"
            >
              Confirm Action
            </h3>
            <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-sm">
              {message}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            className="flex-1 px-4 py-2.5 bg-stone-100/80 dark:bg-stone-800/80 backdrop-blur-sm
                      hover:bg-stone-200/80 dark:hover:bg-stone-700/80 border border-stone-200/50 dark:border-stone-700/50
                      text-stone-700 dark:text-stone-300 rounded-xl transition-all duration-300
                      hover:scale-105 font-semibold shadow-lg shadow-stone-500/10 hover:shadow-stone-500/20
                      flex items-center justify-center space-x-2"
            onClick={onClose}
          >
            <span>Cancel</span>
          </button>

          <button
            type="button"
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700
                      text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg
                      shadow-red-500/25 hover:shadow-red-500/30 font-semibold
                      flex items-center justify-center space-x-2"
            onClick={onConfirm}
          >
            <AlertTriangle size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
