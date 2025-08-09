import React from "react";

const SectionTitle = ({ children, right }) => (
  <div className="flex items-center justify-between mb-3">
    <h3 className="font-semibold tracking-tight text-stone-900 dark:text-stone-100">
      {children}
    </h3>
    {right && <div className="flex items-center gap-2">{right}</div>}
  </div>
);

export default SectionTitle;
