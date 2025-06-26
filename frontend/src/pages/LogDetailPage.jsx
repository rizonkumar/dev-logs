import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createLog, deleteLog } from "../app/features/logsSlice";
import {
  ArrowLeft,
  Calendar,
  PlusCircle,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import Loader from "../components/Loader";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md mx-4 border border-gray-700">
        <div className="flex items-start">
          <div className="flex-shrink-0 mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
            <AlertTriangle
              className="h-6 w-6 text-red-400"
              aria-hidden="true"
            />
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3
              className="text-lg leading-6 font-bold text-white"
              id="modal-title"
            >
              Delete Entry
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-400">{message}</p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            onClick={onConfirm}
          >
            Confirm Delete
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-white hover:bg-gray-600 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

function LogDetailPage() {
  const { date } = useParams();
  const dispatch = useDispatch();
  const [newEntry, setNewEntry] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState(null);

  const { logs, status, error } = useSelector((state) => state.logs);

  const logsForDate = logs.filter((log) => {
    return new Date(log.date).toISOString().split("T")[0] === date;
  });

  const handleAddEntry = (e) => {
    e.preventDefault();
    if (newEntry.trim() === "") return;
    const newLogData = { date: date, entry: newEntry };
    dispatch(createLog(newLogData));
    setNewEntry("");
  };

  const handleDelete = (logId) => {
    setLogToDelete(logId);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (logToDelete) {
      dispatch(deleteLog(logToDelete));
    }
    setIsModalOpen(false);
    setLogToDelete(null);
  };

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (status === "loading") {
    return (
      <div className="max-w-3xl mx-auto">
        <Loader />
      </div>
    );
  }

  if (status === "failed" && !error?.includes("Log not found")) {
    return (
      <div className="max-w-3xl mx-auto text-center py-10 text-red-400">
        Error: {error}
      </div>
    );
  }

  return (
    <>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this log entry? This action cannot be undone."
      />
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            to="/logs"
            className="flex items-center text-sm text-teal-400 hover:text-teal-300 transition-colors mb-4"
          >
            <ArrowLeft size={14} className="mr-2" />
            Back to all logs
          </Link>
          <div className="flex items-center">
            <Calendar size={28} className="text-gray-500 mr-4" />
            <div>
              <h1 className="text-3xl font-bold text-white">Entries for</h1>
              <p className="text-2xl font-medium text-gray-400">
                {formattedDate}
              </p>
            </div>
          </div>
        </div>
        <div className="mb-10">
          <form
            onSubmit={handleAddEntry}
            className="bg-gray-800/60 p-4 rounded-xl border border-gray-700/60"
          >
            <textarea
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              className="w-full bg-gray-900/70 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-teal-400 focus:outline-none transition-all text-gray-300 placeholder-gray-500"
              rows="3"
              placeholder="Add a new entry for this date..."
            />
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center text-sm"
              >
                <PlusCircle size={16} className="mr-2" />
                Add Entry
              </button>
            </div>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-4">
            {logsForDate.length}{" "}
            {logsForDate.length === 1 ? "Entry" : "Entries"}
          </h2>
          {logsForDate.length > 0 ? (
            <ol className="space-y-4">
              {logsForDate.map((log, index) => (
                <li key={log._id} className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="bg-teal-500 text-gray-900 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    {index !== logsForDate.length - 1 && (
                      <div className="w-px h-full bg-gray-700/70 mt-2"></div>
                    )}
                  </div>
                  <div className="bg-gray-800/80 p-5 rounded-lg border border-gray-700/60 w-full flex flex-col">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap flex-grow">
                      {log.entry}
                    </p>
                    <div className="flex justify-end items-center mt-3 pt-3 border-t border-gray-700/50">
                      <button
                        onClick={() => handleDelete(log._id)}
                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded-md transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="text-center py-10 bg-gray-800/50 rounded-lg">
              <p className="text-gray-400">No entries yet for this date.</p>
              <p className="text-gray-500 text-sm mt-1">
                Use the form above to add one!
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default LogDetailPage;
