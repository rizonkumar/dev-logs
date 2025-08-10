import React, { useState } from "react";
import Card from "../Card";
import SectionTitle from "../SectionTitle";
import { Tag, Pencil, Check, X, Trash2, RefreshCw } from "lucide-react";
import catService from "../../../services/finance/categoriesService";

export default function CategoriesManager({ categories, onCreate }) {
  const [form, setForm] = useState({ name: "", type: "EXPENSE" });
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({ name: "", type: "EXPENSE" });
  const [busyId, setBusyId] = useState(null);

  const incomeCats = categories.filter((c) => c.type === "INCOME");
  const expenseCats = categories.filter((c) => c.type === "EXPENSE");

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
    <div className="grid gap-4">
      <Card>
        <SectionTitle>Create Category</SectionTitle>
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          <input
            className="px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex-1 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600"
            placeholder="Category name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <select
            className="px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 w-48 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
          <button
            className="px-4 py-2 rounded-lg bg-stone-900 text-white dark:bg-white dark:text-stone-900 whitespace-nowrap cursor-pointer hover:opacity-90 transition-colors shadow-sm"
            disabled={saving || !form.name}
            onClick={async () => {
              try {
                setSaving(true);
                const created = await onCreate?.({
                  name: form.name.trim(),
                  type: form.type,
                });
                if (created) setForm({ name: "", type: "EXPENSE" });
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving ? "Saving..." : "Create"}
          </button>
        </div>
      </Card>
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div
                  key={c._id}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                    incomePalette[idx % incomePalette.length]
                  }`}
                >
                  {editingId === c._id ? (
                    <>
                      <input
                        value={editDraft.name}
                        onChange={(e) =>
                          setEditDraft((d) => ({ ...d, name: e.target.value }))
                        }
                        className="bg-transparent border-b border-stone-300/50 focus:outline-none pr-1"
                      />
                      <select
                        value={editDraft.type}
                        onChange={(e) =>
                          setEditDraft((d) => ({ ...d, type: e.target.value }))
                        }
                        className="bg-transparent border rounded px-1 py-0.5"
                      >
                        <option value="INCOME">Income</option>
                        <option value="EXPENSE">Expense</option>
                      </select>
                      <button
                        className="ml-1"
                        title="Save"
                        onClick={async () => {
                          setBusyId(c._id);
                          await catService.updateCategory(c._id, {
                            name: editDraft.name.trim(),
                            type: editDraft.type,
                          });
                          setBusyId(null);
                          setEditingId(null);
                        }}
                      >
                        {busyId === c._id ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )}
                      </button>
                      <button
                        title="Cancel"
                        onClick={() => setEditingId(null)}
                        className="ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span>{c.name}</span>
                      <button
                        title="Edit"
                        onClick={() => {
                          setEditingId(c._id);
                          setEditDraft({ name: c.name, type: c.type });
                        }}
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        title="Delete"
                        onClick={async () => {
                          setBusyId(c._id);
                          await catService.deleteCategory(c._id);
                          setBusyId(null);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
              ))}
              {incomeCats.length === 0 && (
                <p className="text-sm text-stone-500">No income categories</p>
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
                <div
                  key={c._id}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                    expensePalette[idx % expensePalette.length]
                  }`}
                >
                  {editingId === c._id ? (
                    <>
                      <input
                        value={editDraft.name}
                        onChange={(e) =>
                          setEditDraft((d) => ({ ...d, name: e.target.value }))
                        }
                        className="bg-transparent border-b border-stone-300/50 focus:outline-none pr-1"
                      />
                      <select
                        value={editDraft.type}
                        onChange={(e) =>
                          setEditDraft((d) => ({ ...d, type: e.target.value }))
                        }
                        className="bg-transparent border rounded px-1 py-0.5"
                      >
                        <option value="INCOME">Income</option>
                        <option value="EXPENSE">Expense</option>
                      </select>
                      <button
                        className="ml-1"
                        title="Save"
                        onClick={async () => {
                          setBusyId(c._id);
                          await catService.updateCategory(c._id, {
                            name: editDraft.name.trim(),
                            type: editDraft.type,
                          });
                          setBusyId(null);
                          setEditingId(null);
                        }}
                      >
                        {busyId === c._id ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )}
                      </button>
                      <button
                        title="Cancel"
                        onClick={() => setEditingId(null)}
                        className="ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span>{c.name}</span>
                      <button
                        title="Edit"
                        onClick={() => {
                          setEditingId(c._id);
                          setEditDraft({ name: c.name, type: c.type });
                        }}
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        title="Delete"
                        onClick={async () => {
                          setBusyId(c._id);
                          await catService.deleteCategory(c._id);
                          setBusyId(null);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
              ))}
              {expenseCats.length === 0 && (
                <p className="text-sm text-stone-500">No expense categories</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
