import React, { useEffect, useMemo, useState } from "react";
import DevLogsHeader from "../components/DevLogsHeader";
import { getOverview } from "../services/finance/dashboardService";
import txService from "../services/finance/transactionsService";
import catService from "../services/finance/categoriesService";
import budgetService from "../services/finance/budgetsService";
import goalsService from "../services/finance/goalsService";
import projectsService from "../services/finance/projectsService";
import calculatorsService from "../services/finance/calculatorsService";
import TransactionForm from "../components/finance/TransactionForm";
import GoalForm from "../components/finance/GoalForm";
import StatCard from "../components/finance/StatCard";
import TransactionsTable from "../components/finance/TransactionsTable";
import Loader from "../components/Loader";
import FinanceCurrencyPicker from "../components/finance/FinanceCurrencyPicker";
import {
  CircleDollarSign,
  TrendingDown,
  TrendingUp,
  Wallet,
  Tag,
} from "lucide-react";

const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 p-4 ${className}`}
  >
    {children}
  </div>
);

// StatCard imported from components/finance/StatCard

const Tab = ({ id, active, onClick, children, icon: Icon, variant }) => {
  const colorStyles = {
    dashboard: {
      active:
        "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800",
      hover:
        "hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-200",
      icon: "text-indigo-600 dark:text-indigo-300",
    },
    transactions: {
      active:
        "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-200 border-sky-200 dark:border-sky-800",
      hover:
        "hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:text-sky-700 dark:hover:text-sky-200",
      icon: "text-sky-600 dark:text-sky-300",
    },
    budgets: {
      active:
        "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-200 border-amber-200 dark:border-amber-800",
      hover:
        "hover:bg-amber-50 dark:hover:bg-amber-900/30 hover:text-amber-700 dark:hover:text-amber-200",
      icon: "text-amber-600 dark:text-amber-300",
    },
    goals: {
      active:
        "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800",
      hover:
        "hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-200",
      icon: "text-emerald-600 dark:text-emerald-300",
    },
    categories: {
      active:
        "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-200 border-violet-200 dark:border-violet-800",
      hover:
        "hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:text-violet-700 dark:hover:text-violet-200",
      icon: "text-violet-600 dark:text-violet-300",
    },
  };
  const colors = colorStyles[variant] || {};
  return (
    <button
      onClick={() => onClick(id)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border flex items-center gap-2 ${
        active
          ? colors.active ||
            "bg-stone-200 dark:bg-stone-800 text-gray-900 dark:text-white border-stone-300 dark:border-stone-700"
          : `${colors.hover || "hover:bg-stone-100 dark:hover:bg-stone-800"} border-transparent text-stone-700 dark:text-stone-300`
      }`}
    >
      {Icon ? <Icon className={`w-4 h-4 ${colors.icon || ""}`} /> : null}
      {children}
    </button>
  );
};

const formatCurrencyWith = (n, currency) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency }).format(
    n || 0
  );

const BudgetBar = ({ spent, total }) => {
  const pct = Math.min(100, Math.round(((spent || 0) / (total || 1)) * 100));
  return (
    <div className="w-full bg-stone-200 dark:bg-stone-800 rounded-full h-3">
      <div
        className={`h-3 rounded-full ${
          pct > 90 ? "bg-red-500" : pct > 70 ? "bg-yellow-500" : "bg-green-500"
        }`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

const SectionTitle = ({ children, right }) => (
  <div className="flex items-center justify-between mb-3">
    <h3 className="font-semibold text-stone-800 dark:text-stone-100">
      {children}
    </h3>
    {right}
  </div>
);

function InlineBudgetEditor({ initialAmount, onSave }) {
  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState(String(initialAmount ?? 0));
  return editing ? (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min="0"
        step="0.01"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="px-2 py-1 rounded bg-stone-100 dark:bg-stone-800 w-28"
      />
      <button
        className="px-2 py-1 rounded bg-green-600 text-white text-xs cursor-pointer hover:bg-green-700 transition-colors"
        onClick={async () => {
          const num = Number(value);
          if (!Number.isNaN(num)) {
            await onSave(num);
            setEditing(false);
          }
        }}
      >
        ✓
      </button>
      <button
        className="px-2 py-1 rounded bg-stone-300 dark:bg-stone-700 text-xs cursor-pointer hover:bg-stone-400 dark:hover:bg-stone-600 transition-colors"
        onClick={() => {
          setValue(String(initialAmount ?? 0));
          setEditing(false);
        }}
      >
        ✕
      </button>
    </div>
  ) : (
    <button
      className="text-xs px-3 py-1 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 cursor-pointer hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
      onClick={() => setEditing(true)}
    >
      Edit Limit
    </button>
  );
}

function InlineContributionAdder({ onSave }) {
  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState("");
  return editing ? (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min="0"
        step="0.01"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="px-2 py-1 rounded bg-stone-100 dark:bg-stone-800 w-28 border border-stone-300 dark:border-stone-700"
        placeholder="Amount"
        autoFocus
      />
      <button
        className="px-2 py-1 rounded bg-emerald-600 text-white text-xs cursor-pointer hover:bg-emerald-700 transition-colors"
        onClick={async () => {
          const num = Number(value);
          if (!Number.isNaN(num) && num > 0) {
            await onSave(num);
            setValue("");
            setEditing(false);
          }
        }}
      >
        ✓
      </button>
      <button
        className="px-2 py-1 rounded bg-rose-600 text-white text-xs cursor-pointer hover:bg-rose-700 transition-colors"
        onClick={() => {
          setValue("");
          setEditing(false);
        }}
      >
        ✕
      </button>
    </div>
  ) : (
    <button
      className="text-xs px-3 py-1 rounded bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 cursor-pointer hover:bg-sky-200 dark:hover:bg-sky-800 transition-colors"
      onClick={() => setEditing(true)}
    >
      Add +
    </button>
  );
}

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [overview, setOverview] = useState(null);
  const [recent, setRecent] = useState([]);

  const [transactions, setTransactions] = useState([]);
  const [txTotal, setTxTotal] = useState(0);
  const [txPage, setTxPage] = useState(1);
  const [txLimit, setTxLimit] = useState(25);
  const [filters, setFilters] = useState({ type: "", q: "" });

  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [progress, setProgress] = useState({});

  const [goals, setGoals] = useState([]);

  const [projects, setProjects] = useState([]);
  const [profit, setProfit] = useState({});
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState(
    () => JSON.parse(localStorage.getItem("userInfo"))?.financeCurrency || "USD"
  );

  // Simple create-form states
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    type: "EXPENSE",
  });
  const [savingCategory, setSavingCategory] = useState(false);

  const [budgetForm, setBudgetForm] = useState({
    category: "",
    month: "",
    year: "",
    amount: "",
  });
  const [savingBudget, setSavingBudget] = useState(false);
  const [budgetOtherName, setBudgetOtherName] = useState("");

  const [projectForm, setProjectForm] = useState({ name: "", client: "" });
  const [savingProject, setSavingProject] = useState(false);

  const month = useMemo(() => new Date().getMonth() + 1, []);
  const year = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.allSettled([
        (async () => {
          try {
            const ov = await getOverview();
            setOverview(ov);
            setRecent(ov.recentTransactions || []);
          } catch (e) {
            console.error("Error fetching overview", e);
          }
        })(),
        (async () => {
          try {
            setCategories(await catService.listCategories());
          } catch (e) {
            console.error("Error fetching categories", e);
          }
        })(),
        (async () => {
          try {
            setBudgets(await budgetService.listBudgets({ month, year }));
          } catch (e) {
            console.error("Error fetching budgets", e);
          }
        })(),
        (async () => {
          try {
            setGoals(await goalsService.listGoals());
          } catch (e) {
            console.error("Error fetching goals", e);
          }
        })(),
        (async () => {
          try {
            setProjects(await projectsService.listProjects());
          } catch (e) {
            console.error("Error fetching projects", e);
          }
        })(),
        (async () => {
          try {
            const res = await txService.listTransactions({
              limit: txLimit,
              page: txPage,
            });
            setTransactions(res.items || []);
            setTxTotal(res.total || 0);
          } catch (e) {
            console.error("Error fetching transactions", e);
          }
        })(),
      ]);
      setLoading(false);
    })();
  }, [month, year, txLimit, txPage]);

  const refreshOverview = async () => {
    try {
      const ov = await getOverview();
      setOverview(ov);
      setRecent(ov.recentTransactions || []);
    } catch {
      // noop
    }
  };

  const refreshTransactions = async () => {
    try {
      const res = await txService.listTransactions({
        limit: txLimit,
        page: txPage,
      });
      setTransactions(res.items || []);
      setTxTotal(res.total || 0);
      await refreshOverview();
    } catch (e) {
      console.error("Failed to refresh transactions", e);
    }
  };

  const refreshGoals = async () => {
    try {
      setGoals(await goalsService.listGoals());
      await refreshOverview();
    } catch (e) {
      console.error("Failed to refresh goals", e);
    }
  };

  const addGoalContribution = async (goalId, amount) => {
    const num = Number(amount);
    if (Number.isNaN(num) || num <= 0) return;
    await goalsService.addContribution(goalId, {
      amount: num,
      date: new Date().toISOString().slice(0, 10),
    });
    await refreshGoals();
  };

  const refreshCategories = async () => {
    try {
      setCategories(await catService.listCategories());
    } catch (e) {
      console.error("Failed to refresh categories", e);
    }
  };

  const refreshProjects = async () => {
    try {
      setProjects(await projectsService.listProjects());
    } catch (e) {
      console.error("Failed to refresh projects", e);
    }
  };

  const refreshProgress = async (categoryId) => {
    const data = await budgetService.getBudgetProgress({
      categoryId,
      month,
      year,
    });
    setProgress((p) => ({ ...p, [categoryId]: data }));
  };

  const filteredTx = useMemo(() => {
    return transactions.filter(
      (t) =>
        (filters.type ? t.type === filters.type : true) &&
        (filters.q
          ? (t.description || "")
              .toLowerCase()
              .includes(filters.q.toLowerCase())
          : true)
    );
  }, [transactions, filters]);

  // Theme is globally controlled in layout; no local toggle here

  return (
    <div className="p-4 sm:p-6">
      <DevLogsHeader />

      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <Tab
            id="dashboard"
            active={activeTab === "dashboard"}
            onClick={setActiveTab}
            icon={Wallet}
            variant="dashboard"
          >
            Dashboard
          </Tab>
          <Tab
            id="transactions"
            active={activeTab === "transactions"}
            onClick={setActiveTab}
            icon={TrendingUp}
            variant="transactions"
          >
            Transactions
          </Tab>
          <Tab
            id="budgets"
            active={activeTab === "budgets"}
            onClick={setActiveTab}
            icon={CircleDollarSign}
            variant="budgets"
          >
            Budgets
          </Tab>
          <Tab
            id="goals"
            active={activeTab === "goals"}
            onClick={setActiveTab}
            icon={TrendingUp}
            variant="goals"
          >
            Goals
          </Tab>
          <Tab
            id="categories"
            active={activeTab === "categories"}
            onClick={setActiveTab}
            variant="categories"
          >
            Categories
          </Tab>
        </div>
        <div className="flex items-center gap-3">
          <FinanceCurrencyPicker current={currency} onChange={setCurrency} />
        </div>
      </div>

      {loading ? (
        <Loader label="Loading finance data..." />
      ) : activeTab === "dashboard" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            icon={Wallet}
            label="Balance (Month)"
            value={formatCurrencyWith(overview?.balance || 0, currency)}
            color="bg-stone-200 dark:bg-stone-800"
          />
          <StatCard
            icon={TrendingUp}
            label="Income (Month)"
            value={formatCurrencyWith(overview?.income || 0, currency)}
            color="bg-green-200/60 dark:bg-green-900/40"
          />
          <StatCard
            icon={TrendingDown}
            label="Expense (Month)"
            value={formatCurrencyWith(overview?.expense || 0, currency)}
            color="bg-red-200/60 dark:bg-red-900/40"
          />
          <StatCard
            icon={CircleDollarSign}
            label="Goals"
            value={`${goals.length} goals`}
            color="bg-sky-200/60 dark:bg-sky-900/40"
          />

          <Card className="md:col-span-2">
            <SectionTitle>Recent Transactions</SectionTitle>
            <div className="space-y-3">
              {recent.map((t) => (
                <div
                  key={t._id}
                  className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        t.type === "INCOME"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                      }`}
                    >
                      {t.type}
                    </span>
                    <span className="text-sm text-stone-600 dark:text-stone-300">
                      {t.description || "—"}
                    </span>
                  </div>
                  <div className="text-sm font-semibold">
                    {formatCurrencyWith(t.amount, currency)}
                  </div>
                </div>
              ))}
              {recent.length === 0 && (
                <p className="text-sm text-stone-500">No recent transactions</p>
              )}
            </div>
          </Card>

          <Card className="md:col-span-2">
            <SectionTitle>Upcoming Bills</SectionTitle>
            <p className="text-sm text-stone-500">
              {(overview?.upcomingBills || []).length} scheduled
            </p>
          </Card>
        </div>
      ) : null}

      {!loading && activeTab === "transactions" && (
        <div className="grid gap-4">
          <TransactionForm
            categories={categories}
            projects={projects}
            onCreated={refreshTransactions}
            onCategoryCreated={refreshCategories}
          />
          <TransactionsTable
            transactions={filteredTx}
            currency={currency}
            filters={filters}
            onChangeFilters={setFilters}
            onDelete={async (id) => {
              await txService.deleteTransaction(id);
              await refreshTransactions();
            }}
            pagination={{
              page: txPage,
              limit: txLimit,
              total: txTotal,
              onPageChange: setTxPage,
              onLimitChange: setTxLimit,
            }}
          />
        </div>
      )}

      {!loading && activeTab === "budgets" && (
        <div className="grid gap-4">
          <Card>
            <SectionTitle>Create Monthly Budget</SectionTitle>
            <div className="grid md:grid-cols-4 gap-3">
              <select
                className="px-3 py-2 rounded bg-stone-100 dark:bg-stone-800"
                value={budgetForm.category}
                onChange={(e) =>
                  setBudgetForm({ ...budgetForm, category: e.target.value })
                }
              >
                <option value="">Select Category</option>
                {categories
                  .filter((c) => c.type === "EXPENSE")
                  .map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                <option value="OTHER">Other…</option>
              </select>
              {budgetForm.category === "OTHER" && (
                <input
                  className="px-3 py-2 rounded bg-stone-100 dark:bg-stone-800"
                  placeholder="New expense category name"
                  value={budgetOtherName}
                  onChange={(e) => setBudgetOtherName(e.target.value)}
                />
              )}
              <input
                type="number"
                min="1"
                max="12"
                placeholder="Month"
                className="px-3 py-2 rounded bg-stone-100 dark:bg-stone-800"
                value={budgetForm.month || month}
                onChange={(e) =>
                  setBudgetForm({ ...budgetForm, month: e.target.value })
                }
              />
              <input
                type="number"
                min="2000"
                max="2100"
                placeholder="Year"
                className="px-3 py-2 rounded bg-stone-100 dark:bg-stone-800"
                value={budgetForm.year || year}
                onChange={(e) =>
                  setBudgetForm({ ...budgetForm, year: e.target.value })
                }
              />
              <div className="flex gap-3">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Amount"
                  className="px-3 py-2 rounded bg-stone-100 dark:bg-stone-800 flex-1"
                  value={budgetForm.amount}
                  onChange={(e) =>
                    setBudgetForm({ ...budgetForm, amount: e.target.value })
                  }
                />
                <button
                  className="px-3 py-2 rounded bg-stone-900 text-white dark:bg-white dark:text-stone-900"
                  disabled={
                    savingBudget || !budgetForm.category || !budgetForm.amount
                  }
                  onClick={async () => {
                    try {
                      setSavingBudget(true);
                      let categoryId = budgetForm.category;
                      if (categoryId === "OTHER") {
                        const name = (budgetOtherName || "").trim();
                        if (!name) return;
                        const createdCat = await catService.createCategory({
                          name,
                          type: "EXPENSE",
                        });
                        categoryId = createdCat._id;
                        await refreshCategories();
                      }
                      await budgetService.createBudget({
                        category: categoryId,
                        month: Number(budgetForm.month || month),
                        year: Number(budgetForm.year || year),
                        amount: Number(budgetForm.amount),
                      });
                      setBudgets(
                        await budgetService.listBudgets({ month, year })
                      );
                      await refreshProgress(categoryId);
                      setBudgetForm({
                        category: "",
                        month: "",
                        year: "",
                        amount: "",
                      });
                      setBudgetOtherName("");
                    } finally {
                      setSavingBudget(false);
                    }
                  }}
                >
                  {savingBudget ? "Saving..." : "Create"}
                </button>
              </div>
            </div>
          </Card>
          {categories
            .filter((c) => c.type === "EXPENSE")
            .map((c) => {
              const currentBudget = budgets.find(
                (b) => (b.category?._id || b.category) === c._id
              );
              return (
                <Card key={c._id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-stone-500">Monthly budget</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <InlineBudgetEditor
                        initialAmount={currentBudget?.amount ?? 0}
                        onSave={async (newAmount) => {
                          if (currentBudget) {
                            await budgetService.updateBudget(
                              currentBudget._id,
                              { amount: newAmount }
                            );
                          } else {
                            await budgetService.createBudget({
                              category: c._id,
                              month,
                              year,
                              amount: newAmount,
                            });
                          }
                          setBudgets(
                            await budgetService.listBudgets({ month, year })
                          );
                          await refreshProgress(c._id);
                        }}
                      />
                      <button
                        onClick={() => refreshProgress(c._id)}
                        className="text-xs px-3 py-1 rounded bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 cursor-pointer hover:bg-sky-200 dark:hover:bg-sky-800 transition-colors"
                      >
                        Refresh
                      </button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <BudgetBar
                      spent={progress[c._id]?.spent || 0}
                      total={progress[c._id]?.budgetAmount || 0}
                    />
                    <div className="mt-2 text-xs text-stone-500">
                      {formatCurrencyWith(
                        progress[c._id]?.spent || 0,
                        currency
                      )}{" "}
                      /{" "}
                      {formatCurrencyWith(
                        progress[c._id]?.budgetAmount || 0,
                        currency
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          {categories.filter((c) => c.type === "EXPENSE").length === 0 && (
            <p className="text-sm text-stone-500">No expense categories yet.</p>
          )}
          {budgets.length > 0 && (
            <Card>
              <SectionTitle>Existing Budgets (This Month)</SectionTitle>
              <ul className="text-sm space-y-1">
                {budgets.map((b) => (
                  <li key={b._id} className="flex justify-between">
                    <span>
                      {typeof b.category === "object"
                        ? b.category?.name
                        : categories.find((c) => c._id === b.category)?.name ||
                          "—"}
                    </span>
                    <span>{formatCurrencyWith(b.amount, currency)}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}

      {!loading && activeTab === "goals" && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="sm:col-span-2 xl:col-span-3">
            <GoalForm onCreated={refreshGoals} />
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
                        onSave={(amt) => addGoalContribution(g._id, amt)}
                      />
                    </div>
                  }
                >
                  {g.name}
                </SectionTitle>
                <BudgetBar spent={current} total={g.targetAmount || 0} />
                <div className="mt-2 text-sm">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                    {formatCurrencyWith(current, currency)}
                  </span>
                  <span className="text-stone-500 dark:text-stone-400">
                    {" "}
                    /{" "}
                  </span>
                  <span className="text-sky-700 dark:text-sky-300">
                    {formatCurrencyWith(g.targetAmount, currency)}
                  </span>
                </div>
              </Card>
            );
          })}
          {goals.length === 0 && (
            <p className="text-sm text-stone-500">No goals</p>
          )}
        </div>
      )}

      {/* Projects section removed */}
      {activeTab === "__removed_projects__" && (
        <div className="grid gap-4">
          <Card>
            <div className="grid md:grid-cols-3 gap-3">
              <input
                className="px-3 py-2 rounded bg-stone-100 dark:bg-stone-800"
                placeholder="Project name"
                value={projectForm.name}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, name: e.target.value })
                }
              />
              <input
                className="px-3 py-2 rounded bg-stone-100 dark:bg-stone-800"
                placeholder="Client (optional)"
                value={projectForm.client}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, client: e.target.value })
                }
              />
              <div className="flex items-center justify-end">
                <button
                  className="px-3 py-2 rounded bg-stone-900 text-white dark:bg-white dark:text-stone-900"
                  disabled={savingProject || !projectForm.name}
                  onClick={async () => {
                    try {
                      setSavingProject(true);
                      await projectsService.createProject({
                        name: projectForm.name,
                        client: projectForm.client || undefined,
                      });
                      setProjectForm({ name: "", client: "" });
                      await refreshProjects();
                    } finally {
                      setSavingProject(false);
                    }
                  }}
                >
                  {savingProject ? "Saving..." : "Create"}
                </button>
              </div>
            </div>
          </Card>
          {projects.map((p) => (
            <Card key={p._id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-stone-500">{p.client || "—"}</p>
                </div>
                <button
                  className="text-xs px-3 py-1 rounded bg-stone-200 dark:bg-stone-800"
                  onClick={async () =>
                    setProfit({
                      ...profit,
                      [p._id]: await projectsService.getProfitability(p._id),
                    })
                  }
                >
                  View Profitability
                </button>
              </div>
              {profit[p._id] && (
                <div className="mt-3 text-sm">
                  <div>
                    Income:{" "}
                    {formatCurrencyWith(profit[p._id].totalIncome, currency)}
                  </div>
                  <div>
                    Expense:{" "}
                    {formatCurrencyWith(profit[p._id].totalExpense, currency)}
                  </div>
                  <div className="font-semibold">
                    Profit: {formatCurrencyWith(profit[p._id].profit, currency)}
                  </div>
                </div>
              )}
            </Card>
          ))}
          {projects.length === 0 && (
            <p className="text-sm text-stone-500">No projects</p>
          )}
        </div>
      )}

      {!loading && activeTab === "categories" && (
        <div className="grid gap-4">
          <Card>
            <SectionTitle>Create Category</SectionTitle>
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
              <input
                className="px-3 py-2 rounded bg-stone-100 dark:bg-stone-800 flex-1"
                placeholder="Category name"
                value={categoryForm.name}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, name: e.target.value })
                }
              />
              <select
                className="px-3 py-2 rounded bg-stone-100 dark:bg-stone-800 w-48"
                value={categoryForm.type}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, type: e.target.value })
                }
              >
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
              <button
                className="px-4 py-2 rounded bg-stone-900 text-white dark:bg-white dark:text-stone-900 whitespace-nowrap cursor-pointer hover:opacity-90 transition"
                disabled={savingCategory || !categoryForm.name}
                onClick={async () => {
                  try {
                    setSavingCategory(true);
                    await catService.createCategory({
                      name: categoryForm.name.trim(),
                      type: categoryForm.type,
                    });
                    setCategoryForm({ name: "", type: "EXPENSE" });
                    await refreshCategories();
                  } finally {
                    setSavingCategory(false);
                  }
                }}
              >
                {savingCategory ? "Saving..." : "Create"}
              </button>
            </div>
          </Card>
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(() => {
                const incomeCats = categories.filter(
                  (c) => c.type === "INCOME"
                );
                const expenseCats = categories.filter(
                  (c) => c.type === "EXPENSE"
                );
                const incomePalette = [
                  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
                  "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
                  "bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300",
                ];
                const expensePalette = [
                  "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
                  "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
                  "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
                ];
                return (
                  <>
                    <div>
                      <SectionTitle
                        right={
                          <span className="text-xs text-stone-500">
                            {incomeCats.length} total
                          </span>
                        }
                      >
                        <span className="inline-flex items-center gap-2">
                          <Tag className="w-4 h-4" /> Income Categories
                        </span>
                      </SectionTitle>
                      <div className="flex flex-wrap gap-2">
                        {incomeCats.map((c, idx) => (
                          <span
                            key={c._id}
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                              incomePalette[idx % incomePalette.length]
                            }`}
                          >
                            {c.name}
                          </span>
                        ))}
                        {incomeCats.length === 0 && (
                          <p className="text-sm text-stone-500">
                            No income categories
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <SectionTitle
                        right={
                          <span className="text-xs text-stone-500">
                            {expenseCats.length} total
                          </span>
                        }
                      >
                        <span className="inline-flex items-center gap-2">
                          <Tag className="w-4 h-4" /> Expense Categories
                        </span>
                      </SectionTitle>
                      <div className="flex flex-wrap gap-2">
                        {expenseCats.map((c, idx) => (
                          <span
                            key={c._id}
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                              expensePalette[idx % expensePalette.length]
                            }`}
                          >
                            {c.name}
                          </span>
                        ))}
                        {expenseCats.length === 0 && (
                          <p className="text-sm text-stone-500">
                            No expense categories
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </Card>
        </div>
      )}

      {/* Calculators section removed */}
      {activeTab === "__removed_calculators__" && (
        <div className="grid gap-4 max-w-3xl">
          <Card>
            <SectionTitle>Contract vs Full-Time</SectionTitle>
            <button
              className="px-3 py-2 rounded bg-stone-200 dark:bg-stone-800 text-sm"
              onClick={async () => {
                const res = await calculatorsService.contractVsFullTime({
                  contract: {
                    dayRate: 600,
                    daysPerWeek: 5,
                    weeks: 46,
                    taxRate: 0.35,
                  },
                  fullTime: {
                    salary: 150000,
                    bonus: 10000,
                    stockValue: 15000,
                    taxRate: 0.32,
                  },
                });
                alert(
                  `Net diff: ${formatCurrencyWith(res.differenceNet, currency)}`
                );
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
                alert(
                  `Projected NW: ${formatCurrencyWith(
                    res.projectedNetWorth,
                    currency
                  )} | Progress: ${(res.progress * 100).toFixed(1)}%`
                );
              }}
            >
              Run Example
            </button>
          </Card>
        </div>
      )}
    </div>
  );
}
