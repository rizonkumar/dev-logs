import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft, Calendar, PlusCircle } from "lucide-react";
import Loader from "../components/Loader";

function LogDetailPage() {
  const { date } = useParams();
  const [newEntry, setNewEntry] = useState("");

  const { logs, status, error } = useSelector((state) => state.logs);

  const logsForDate = logs.filter((log) => {
    return new Date(log.date).toISOString().split("T")[0] === date;
  });

  const handleAddEntry = (e) => {
    e.preventDefault();
    if (newEntry.trim() === "") return;

    console.log("TODO: Implement create log API call.");

    setNewEntry("");
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

  if (status === "failed") {
    return (
      <div className="max-w-3xl mx-auto text-center py-10 text-red-400">
        Error loading data: {error}
      </div>
    );
  }

  return (
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
          {logsForDate.length} {logsForDate.length === 1 ? "Entry" : "Entries"}
        </h2>
        {logsForDate.length > 0 ? (
          <ol className="space-y-4">
            {logsForDate.map((log, index) => (
              <li key={log._id || index} className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div className="bg-teal-500 text-gray-900 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  {index !== logsForDate.length - 1 && (
                    <div className="w-px h-full bg-gray-700/70 mt-2"></div>
                  )}
                </div>
                <div className="bg-gray-800/80 p-5 rounded-lg border border-gray-700/60 w-full">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {log.entry}
                  </p>
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
  );
}

export default LogDetailPage;
