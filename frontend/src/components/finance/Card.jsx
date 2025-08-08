import React from "react";

const Card = ({ children, className = "" }) => (
  <div className={`rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 p-4 ${className}`}>
    {children}
  </div>
);

export default Card;


