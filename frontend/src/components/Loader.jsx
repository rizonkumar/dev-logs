import React from "react";

const Loader = ({ label = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-4 border-stone-300 dark:border-stone-700"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-stone-900 dark:border-t-white animate-spin"></div>
      </div>
      <p className="mt-3 text-sm text-stone-500 dark:text-stone-400">{label}</p>
    </div>
  );
};

export default Loader;
