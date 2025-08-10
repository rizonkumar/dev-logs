import React from "react";

const Loader = ({ label = "Loading...", small = false, inline = false }) => {
  const size = small ? 20 : 56;
  const ring = small ? 3 : 4;
  const content = (
    <div className="relative" style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full border-transparent"
        style={{ borderWidth: ring }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 via-violet-600 to-emerald-500 opacity-20" />
      </div>
      <div
        className="absolute inset-0 rounded-full border-t-stone-900 dark:border-t-white animate-spin"
        style={{
          borderWidth: ring,
          borderRightColor: "transparent",
          borderBottomColor: "transparent",
          borderLeftColor: "transparent",
        }}
      />
      <div className="absolute inset-0 rounded-full blur-sm bg-gradient-to-tr from-blue-500 via-violet-500 to-emerald-400 opacity-20" />
    </div>
  );

  if (inline) {
    return (
      <span className="inline-flex items-center gap-2">
        {content}
        {label ? (
          <span className="text-xs text-stone-500 dark:text-stone-400">
            {label}
          </span>
        ) : null}
      </span>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-10">
      {content}
      {label && (
        <p className="mt-3 text-sm text-stone-500 dark:text-stone-400">
          {label}
        </p>
      )}
    </div>
  );
};

export default Loader;
