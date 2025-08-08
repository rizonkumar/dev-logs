import React from "react";
import Card from "./Card";
import SectionTitle from "./SectionTitle";

export default function CategoriesList({ categories }) {
  const incomeCats = categories.filter((c) => c.type === "INCOME");
  const expenseCats = categories.filter((c) => c.type === "EXPENSE");
  return (
    <div className="grid gap-4">
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <SectionTitle>Income Categories</SectionTitle>
            <ul className="text-sm space-y-1">
              {incomeCats.map((c) => (
                <li key={c._id}>{c.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <SectionTitle>Expense Categories</SectionTitle>
            <ul className="text-sm space-y-1">
              {expenseCats.map((c) => (
                <li key={c._id}>{c.name}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}


