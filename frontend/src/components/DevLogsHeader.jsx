import React from "react";

function DevLogsHeader() {
  return (
    <div className="mb-8">
      <div className="flex items-center">
        <img
          src="https://i.pravatar.cc/100?u=a042581f4e29026704d"
          alt="Your Name"
          className="w-20 h-20 rounded-full border-4 border-gray-800"
        />
        <div className="ml-4">
          <h1 className="text-2xl font-bold text-white">Rizon Kumar Rahi</h1>
          <p className="text-sm text-gray-400">
            Software Developer<span className="text-teal-400"> . </span>
            sde<span className="text-teal-400"> . </span>
            Building products
          </p>
        </div>
      </div>
    </div>
  );
}

export default DevLogsHeader;
