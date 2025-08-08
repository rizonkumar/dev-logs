import React from "react";
import Card from "./Card";
import BudgetBar from "./BudgetBar";

const formatCurrency = (n, currency = "USD") =>
  new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n || 0);

export default function GoalsGrid({ goals, currency }) {
  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {goals.map((g) => {
        const current = (g.contributions || []).reduce((sum, c) => sum + (c.amount || 0), 0);
        return (
          <Card key={g._id}>
            <div className="font-semibold mb-2">{g.name}</div>
            <BudgetBar spent={current} total={g.targetAmount || 0} />
            <div className="mt-2 text-sm">{formatCurrency(current, currency)} / {formatCurrency(g.targetAmount, currency)}</div>
          </Card>
        );
      })}
      {goals.length === 0 && <p className="text-sm text-stone-500">No goals</p>}
    </div>
  );
}


