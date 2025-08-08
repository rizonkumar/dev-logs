import React from "react";
import Card from "./Card";
import BudgetBar from "./BudgetBar";

const formatCurrency = (n, currency = "USD") =>
  new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n || 0);

export default function BudgetsList({ categories, progressByCategory, onRefresh, currency }) {
  const expenseCategories = categories.filter((c) => c.type === "EXPENSE");
  return (
    <div className="grid gap-4">
      {expenseCategories.map((c) => (
        <Card key={c._id}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-stone-500">Monthly budget</p>
            </div>
            <button onClick={() => onRefresh(c._id)} className="text-xs px-3 py-1 rounded bg-stone-200 dark:bg-stone-800">Refresh</button>
          </div>
          <div className="mt-3">
            <BudgetBar spent={progressByCategory[c._id]?.spent || 0} total={progressByCategory[c._id]?.budgetAmount || 0} />
            <div className="mt-2 text-xs text-stone-500">{formatCurrency(progressByCategory[c._id]?.spent || 0, currency)} / {formatCurrency(progressByCategory[c._id]?.budgetAmount || 0, currency)}</div>
          </div>
        </Card>
      ))}
      {expenseCategories.length === 0 && <p className="text-sm text-stone-500">No expense categories yet.</p>}
    </div>
  );
}


