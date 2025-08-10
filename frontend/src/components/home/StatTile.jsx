import React from "react";

const StatTile = ({
  icon,
  title,
  value,
  suffix,
  className = "",
  iconWrapClass = "",
}) => (
  <div
    className={`p-3 rounded-xl border shadow-xs transition-transform hover:-translate-y-[1px] ${className}`}
  >
    <div className="flex items-center gap-3 min-h-14">
      <div
        className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ring-1 ${iconWrapClass}`}
      >
        {(() => {
          const IconComp = icon;
          return <IconComp size={20} aria-hidden="true" />;
        })()}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wide font-semibold opacity-80 truncate">
          {title}
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold leading-none">{value}</span>
          {suffix ? <span className="text-xs opacity-70">{suffix}</span> : null}
        </div>
      </div>
    </div>
  </div>
);

export default StatTile;
