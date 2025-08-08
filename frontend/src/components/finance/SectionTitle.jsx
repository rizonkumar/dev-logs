import React from "react";

const SectionTitle = ({ children, right }) => (
  <div className="flex items-center justify-between mb-3">
    <h3 className="font-semibold text-stone-800 dark:text-stone-100">{children}</h3>
    {right}
  </div>
);

export default SectionTitle;


