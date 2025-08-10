import React from "react";

const Logo = ({ size = 36, withText = true }) => {
  const s = typeof size === "number" ? size : 36;
  return (
    <div className="flex items-center gap-2 select-none">
      <div
        className="relative grid place-items-center rounded-xl overflow-hidden"
        style={{ width: s, height: s }}
        aria-hidden
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-violet-600 to-emerald-500 dark:from-blue-500 dark:via-violet-500 dark:to-emerald-400" />
        <div className="absolute -inset-1 blur-md opacity-60 bg-gradient-to-br from-blue-400 via-violet-400 to-emerald-300 dark:opacity-40" />
        <span
          className="relative z-10 font-black text-white text-lg"
          style={{ letterSpacing: 0.5 }}
        >
          DD
        </span>
      </div>
      {withText && (
        <div className="leading-tight">
          <div className="font-extrabold text-gray-900 dark:text-white">
            DevDecks
          </div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 dark:text-stone-300">
            Developer Dashboard
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;
