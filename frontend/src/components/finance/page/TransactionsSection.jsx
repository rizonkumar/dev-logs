import React from "react";
import TransactionForm from "../TransactionForm";
import TransactionsTable from "../TransactionsTable";

export default function TransactionsSection({
  categories,
  projects,
  onCreated,
  onCategoryCreated,
  transactions,
  currency,
  filters,
  onChangeFilters,
  onDelete,
  pagination,
}) {
  return (
    <div className="grid gap-4">
      <TransactionForm
        categories={categories}
        projects={projects}
        onCreated={onCreated}
        onCategoryCreated={onCategoryCreated}
      />
      <TransactionsTable
        transactions={transactions}
        currency={currency}
        filters={filters}
        onChangeFilters={onChangeFilters}
        onDelete={onDelete}
        pagination={pagination}
      />
    </div>
  );
}
