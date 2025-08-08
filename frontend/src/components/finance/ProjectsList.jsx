import React from "react";
import Card from "./Card";

const formatCurrency = (n, currency = "USD") =>
  new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n || 0);

export default function ProjectsList({ projects, profitByProject, onLoadProfit, currency }) {
  return (
    <div className="grid gap-4">
      {projects.map((p) => (
        <Card key={p._id}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-xs text-stone-500">{p.client || "—"}</p>
            </div>
            <button
              className="text-xs px-3 py-1 rounded bg-stone-200 dark:bg-stone-800"
              onClick={() => onLoadProfit(p._id)}
            >
              View Profitability
            </button>
          </div>
          {profitByProject[p._id] && (
            <div className="mt-3 text-sm">
              <div>Income: {formatCurrency(profitByProject[p._id].totalIncome, currency)}</div>
              <div>Expense: {formatCurrency(profitByProject[p._id].totalExpense, currency)}</div>
              <div className="font-semibold">Profit: {formatCurrency(profitByProject[p._id].profit, currency)}</div>
            </div>
          )}
        </Card>
      ))}
      {projects.length === 0 && <p className="text-sm text-stone-500">No projects</p>}
    </div>
  );
}


