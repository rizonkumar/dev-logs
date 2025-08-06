import React from "react";
import { AlertTriangle } from "lucide-react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/10 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4 border border-stone-200">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center border border-red-200">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Delete Entry
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-8">
          <button
            type="button"
            className="flex-1 px-4 py-2.5 text-gray-700 bg-white border border-stone-300
                      hover:bg-stone-50 rounded-xl transition-all duration-300 font-medium"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl 
                      transition-all duration-300 font-medium shadow-sm"
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
