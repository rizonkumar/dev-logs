import React from "react";

const AchievementBadge = ({
  achieved,
  icon,
  label,
  achievedClass = "",
  baseClass = "",
}) => {
  const IconComp = icon;
  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ring-1 ${
        achieved ? achievedClass : `${baseClass} opacity-70`
      }`}
    >
      <IconComp size={14} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
};

export default AchievementBadge;
