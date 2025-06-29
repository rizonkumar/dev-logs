import React from "react";
import { AlertTriangle } from "lucide-react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity">
      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 border border-gray-700/50">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center border border-red-500/30">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-white mb-2">Delete Entry</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex space-x-3 mt-8">
          <button
            type="button"
            className="flex-1 px-4 py-3 text-gray-300 border border-gray-600 hover:border-gray-500 
                      hover:text-white rounded-xl transition-all duration-300 font-medium"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 
                      hover:from-red-600 hover:to-pink-600 text-white rounded-xl 
                      transition-all duration-300 font-medium shadow-lg shadow-red-500/25"
            onClick={onConfirm}
          >
            Delete Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
