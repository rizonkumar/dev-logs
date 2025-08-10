import React from "react";

const MilestoneChip = ({
  active,
  icon,
  label,
  activeClass = "",
  baseClass = "",
}) => {
  const IconComp = icon;
  return (
    <div
      className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ring-1 ${
        active ? activeClass : `${baseClass} opacity-70`
      }`}
    >
      <IconComp size={12} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
};

export default MilestoneChip;
