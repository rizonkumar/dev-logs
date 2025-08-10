import React from "react";
import TransactionForm from "../TransactionForm";
import TransactionsTable from "../TransactionsTable";
import EditTransactionModal from "../EditTransactionModal";

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
  const [editing, setEditing] = React.useState(null);
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
        onEdit={(t) => setEditing(t)}
        pagination={pagination}
      />
      <EditTransactionModal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        transaction={editing}
        categories={categories}
        projects={projects}
        onUpdated={onCreated}
        onCategoryCreated={onCategoryCreated}
      />
    </div>
  );
}
