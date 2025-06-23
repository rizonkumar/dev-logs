import React from "react";

function DevLogsHeader() {
  return (
    <div className="mb-12">
      <div className="relative rounded-lg overflow-hidden border border-gray-700/60">
        <img
          src="https://placehold.co/1200x300/1a202c/7dd3fc?text=Banner+Image"
          alt="Banner"
          className="w-full h-48 object-cover"
        />
        <div
          className="absolute inset-0 bg-repeat"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backgroundImage:
              "radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
            backgroundSize: "4px 4px",
          }}
        ></div>
      </div>

      <div className="flex items-center -mt-10 ml-8 z-10 relative">
        <img
          src="https://i.pravatar.cc/100?u=a042581f4e29026704d"
          alt="Rizon Kumar Rahi"
          className="w-24 h-24 rounded-full border-4 border-gray-800"
        />
        <div className="ml-4 mt-8">
          <h1 className="text-2xl font-bold text-white">Rizon Kumar Rahi</h1>
          <p className="text-sm text-gray-400">
            Software Developer<span className="text-teal-400"> . </span>Merkle
            Inspire
            <span className="text-teal-400"> . </span>Building products
          </p>
        </div>
      </div>
    </div>
  );
}

export default DevLogsHeader;
