import React from "react";

const Logo = ({ size = 36, withText = true, animated = true }) => {
  const s = typeof size === "number" ? size : 36;
  return (
    <div
      className="flex items-center gap-2 select-none"
      aria-label="DevDecks logo"
    >
      <div
        className="relative grid place-items-center rounded-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10"
        style={{ width: s, height: s }}
        aria-hidden
      >
        {/* Gradient core */}
        <div className="absolute inset-px rounded-2xl bg-gradient-to-br from-blue-600 via-violet-600 to-emerald-500 dark:from-blue-500 dark:via-violet-500 dark:to-emerald-400" />
        {/* Inner glass */}
        <div className="absolute inset-[3px] rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur-xs" />
        {/* Orbit ring */}
        <div
          className={`absolute h-[140%] w-[140%] rounded-full border-2 border-white/30 dark:border-white/20 translate-y-1/6 ${
            animated ? "animate-[spin_12s_linear_infinite]" : ""
          }`}
          style={{ boxShadow: "inset 0 0 20px rgba(255,255,255,0.2)" }}
        />
        {/* Monogram */}
        <span
          className="relative z-10 font-black text-white drop-shadow-sm"
          style={{ letterSpacing: 0.5, fontSize: Math.max(12, s * 0.42) }}
        >
          DD
        </span>
        {/* Shine */}
        {animated && (
          <div className="absolute -left-1 -top-3 h-10 w-10 rotate-12 bg-white/30 blur-xl" />
        )}
      </div>
      {withText && (
        <div className="leading-tight">
          <div className="font-extrabold text-gray-900 dark:text-white tracking-tight">
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
