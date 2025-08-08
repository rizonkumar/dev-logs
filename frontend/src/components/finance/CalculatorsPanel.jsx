import React from "react";
import Card from "./Card";
import SectionTitle from "./SectionTitle";
import calculatorsService from "../../services/finance/calculatorsService";

const formatCurrency = (n, currency = "USD") =>
  new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n || 0);

export default function CalculatorsPanel({ currency }) {
  return (
    <div className="grid gap-4 max-w-3xl">
      <Card>
        <SectionTitle>Contract vs Full-Time</SectionTitle>
        <button
          className="px-3 py-2 rounded bg-stone-200 dark:bg-stone-800 text-sm"
          onClick={async () => {
            const res = await calculatorsService.contractVsFullTime({
              contract: { dayRate: 600, daysPerWeek: 5, weeks: 46, taxRate: 0.35 },
              fullTime: { salary: 150000, bonus: 10000, stockValue: 15000, taxRate: 0.32 },
            });
            alert(`Net diff: ${formatCurrency(res.differenceNet, currency)}`);
          }}
        >
          Run Example
        </button>
      </Card>

      <Card>
        <SectionTitle>FIRE Calculator</SectionTitle>
        <button
          className="px-3 py-2 rounded bg-stone-200 dark:bg-stone-800 text-sm"
          onClick={async () => {
            const res = await calculatorsService.fire({
              currentSavings: 50000,
              monthlyContribution: 2000,
              expectedReturnRate: 0.05,
              withdrawalRate: 0.04,
              annualExpenses: 60000,
              years: 25,
            });
            alert(`Projected NW: ${formatCurrency(res.projectedNetWorth, currency)} | Progress: ${(res.progress * 100).toFixed(1)}%`);
          }}
        >
          Run Example
        </button>
      </Card>
    </div>
  );
}


