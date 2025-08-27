import React from "react";
import { AlertTriangle } from "lucide-react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md flex justify-center items-center z-50
                    transition-all duration-300 p-4 animate-in fade-in zoom-in-95"
    >
      <div
        className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl rounded-3xl shadow-2xl
                    p-8 w-full max-w-lg mx-4 border border-stone-200/50 dark:border-stone-700/50
                    shadow-stone-900/10 dark:shadow-stone-100/10"
      >
        {/* Header */}
        <div className="flex items-start space-x-6 mb-8">
          <div className="relative flex-shrink-0">
            <div
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-100 to-red-200 dark:from-red-950/40 dark:to-red-900/40
                          flex items-center justify-center border border-red-200/50 dark:border-red-800/50 shadow-lg shadow-red-500/20"
            >
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full" />
          </div>

          <div className="flex-grow pt-2">
            <h3
              className="text-2xl font-bold bg-gradient-to-r from-stone-900 to-stone-700 dark:from-stone-100 dark:to-stone-300
                          bg-clip-text text-transparent mb-3"
            >
              Confirm Action
            </h3>
            <p className="text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
              {message}
            </p>
          </div>
        </div>

        {/* Warning Section */}
        <div
          className="bg-red-50/80 dark:bg-red-950/30 backdrop-blur-sm border border-red-200/50 dark:border-red-800/50
                      rounded-2xl p-4 mb-8"
        >
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertTriangle
                size={16}
                className="text-red-600 dark:text-red-400"
              />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">
                This action cannot be undone
              </h4>
              <p className="text-xs text-red-700 dark:text-red-400 leading-relaxed">
                Once you proceed, this data will be permanently removed from
                your account.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            className="flex-1 px-6 py-3 bg-stone-100/80 dark:bg-stone-800/80 backdrop-blur-sm
                      hover:bg-stone-200/80 dark:hover:bg-stone-700/80 border border-stone-200/50 dark:border-stone-700/50
                      text-stone-700 dark:text-stone-300 rounded-2xl transition-all duration-300
                      hover:scale-105 font-semibold shadow-lg shadow-stone-500/10 hover:shadow-stone-500/20
                      flex items-center justify-center space-x-2"
            onClick={onClose}
          >
            <span>Cancel</span>
          </button>

          <button
            type="button"
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700
                      text-white rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg
                      shadow-red-500/25 hover:shadow-red-500/30 font-semibold
                      flex items-center justify-center space-x-2"
            onClick={onConfirm}
          >
            <AlertTriangle size={18} />
            <span>Confirm Delete</span>
          </button>
        </div>

        {/* Footer Note */}
        <div className="mt-6 pt-6 border-t border-stone-200/50 dark:border-stone-700/50">
          <p className="text-xs text-stone-500 dark:text-stone-400 text-center">
            Click outside the modal or press Escape to cancel
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
