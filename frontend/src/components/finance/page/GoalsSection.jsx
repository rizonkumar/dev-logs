import React from "react";
import Card from "../Card";
import SectionTitle from "../SectionTitle";
import GoalForm from "../GoalForm";
import BudgetBar from "../BudgetBar";
import InlineContributionAdder from "./InlineContributionAdder";

const formatCurrency = (n, currency = "USD") =>
  new Intl.NumberFormat(undefined, { style: "currency", currency }).format(
    n || 0
  );

export default function GoalsSection({
  goals,
  currency,
  onAddContribution,
  onCreated,
}) {
  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
      <div className="sm:col-span-2 xl:col-span-3">
        <GoalForm onCreated={onCreated} />
      </div>
      {goals.map((g) => {
        const current = (g.contributions || []).reduce(
          (sum, c) => sum + (c.amount || 0),
          0
        );
        return (
          <Card key={g._id}>
            <SectionTitle
              right={
                <div className="flex items-center gap-2">
                  <InlineContributionAdder
                    onSave={(amt) => onAddContribution?.(g._id, amt)}
                  />
                </div>
              }
            >
              {g.name}
            </SectionTitle>
            <BudgetBar spent={current} total={g.targetAmount || 0} />
            <div className="mt-2 text-sm">
              <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                {formatCurrency(current, currency)}
              </span>
              <span className="text-stone-500 dark:text-stone-400"> / </span>
              <span className="text-sky-700 dark:text-sky-300">
                {formatCurrency(g.targetAmount, currency)}
              </span>
            </div>
          </Card>
        );
      })}
      {goals.length === 0 && <p className="text-sm text-stone-500">No goals</p>}
    </div>
  );
}
