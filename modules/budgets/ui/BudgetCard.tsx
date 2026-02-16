// modules/budgets/ui/BudgetCard.tsx
import React, { useState } from "react";
import { useThemeContext } from "@/context/ThemeContext";

export interface Subcategory {
  name: string;
  estimatedAmount?: number;
  actualAmount?: number;
  vendors?: { vendor: string; amount: number }[];
}

export interface BudgetItem {
  _id: string;
  category: string;
  estimatedAmount?: number;
  actualAmount?: number;
  subcategories?: Subcategory[];
}

interface VendorOption {
  _id: string;
  name: string;
  avatar?: string;
}

interface Props {
  budget: BudgetItem;
  updateBudget: (id: string, payload: Partial<BudgetItem>) => void;
  addSubcategory: (budgetId: string) => void;
  updateSubcategory: (
    budgetId: string,
    index: number,
    field: keyof Subcategory,
    value: any
  ) => void;
  deleteSubcategory: (budgetId: string, index: number) => void;
  deleteBudget: (budgetId: string) => void;
  vendors: VendorOption[];
}

const BudgetCard: React.FC<Props> = ({
  budget,
  updateBudget,
  addSubcategory,
  updateSubcategory,
  deleteSubcategory,
  deleteBudget,
  vendors,
}) => {
  const [edit, setEdit] = useState(false);
  const { theme } = useThemeContext();

  return (
    <div className={`  ${theme === "dark" ? "bg-gray-800 border-gray-800" : "bg-[#F3F4F6] border-gray-200"} rounded-2xl shadow p-4 space-y-4`}>
      {/* Header: Category */}
      <div className="flex justify-between items-center">
        {edit ? (
          <input
            value={budget.category}
            onChange={(e) =>
              updateBudget(budget._id, { category: e.target.value })
            }
            className="text-lg font-semibold border-b border-gray-300"
          />
        ) : (
          <h3 className="text-lg font-semibold">{budget.category}</h3>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => setEdit(!edit)}
            className="px-3 py-1 bg-indigo-500 text-white rounded"
          >
            {edit ? "Save" : "Edit"}
          </button>
          {edit && (
            <button
              onClick={() => deleteBudget(budget._id)}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Delete Category
            </button>
          )}
        </div>
      </div>

      {/* Amounts */}
      <div className="grid grid-cols-2 gap-4">
        {edit ? (
          <>
            <input
              type="number"
              value={budget.estimatedAmount ?? ""}
              onChange={(e) =>
                updateBudget(budget._id, {
                  estimatedAmount:
                    e.target.value === "" ? 0 : Number(e.target.value),
                })
              }
              className="border rounded px-2 py-1"
              placeholder="Estimated Amount"
            />
            <input
              type="number"
              value={budget.actualAmount ?? ""}
              onChange={(e) =>
                updateBudget(budget._id, {
                  actualAmount:
                    e.target.value === "" ? 0 : Number(e.target.value),
                })
              }
              className="border rounded px-2 py-1"
              placeholder="Actual Amount"
            />
          </>
        ) : (
          <>
            <p>Estimated: ${budget.estimatedAmount || 0}</p>
            <p>Actual: ${budget.actualAmount || 0}</p>
          </>
        )}
      </div>

      {/* Subcategories */}
      {budget.subcategories?.map((s, i) => (
        <div key={i} className="grid grid-cols-6 gap-1 items-center">
          {edit ? (
            <>
              <input
                placeholder="Item"
                className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-indigo-500 col-span-1"
                value={s.name}
                onChange={(e) =>
                  updateSubcategory(budget._id, i, "name", e.target.value)
                }
              />
              <input
                placeholder="Estimated"
                type="number"
                className="border border-gray-300 rounded px-2 py-1 col-span-1"
                value={s.estimatedAmount ?? ""}
                onChange={(e) =>
                  updateSubcategory(
                    budget._id,
                    i,
                    "estimatedAmount",
                    e.target.value === "" ? 0 : Number(e.target.value)
                  )
                }
              />
              <input
                placeholder="Actual"
                type="number"
                className="border border-gray-300 rounded px-2 py-1 col-span-1"
                value={s.actualAmount ?? ""}
                onChange={(e) =>
                  updateSubcategory(
                    budget._id,
                    i,
                    "actualAmount",
                    e.target.value === "" ? 0 : Number(e.target.value)
                  )
                }
              />
              <select
                value={s.vendors?.[0]?.vendor || ""}
                className={`border ${theme === "dark" ? "bg-gray-800 border-gray-800" : "bg-white border-gray-200"} rounded px-2 py-1 col-span-1`}
                onChange={(e) =>
                  updateSubcategory(budget._id, i, "vendors", [
                    {
                      vendor: e.target.value,
                      amount: s.vendors?.[0]?.amount || 0,
                    },
                  ])
                }
              >
                <option value="">Select Vendor</option>
                {vendors.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Vendor Amount"
                className="border border-gray-300 rounded px-2 py-1 col-span-1"
                value={s.vendors?.[0]?.amount ?? ""}
                onChange={(e) =>
                  updateSubcategory(budget._id, i, "vendors", [
                    {
                      vendor: s.vendors?.[0]?.vendor || "",
                      amount: +e.target.value,
                    },
                  ])
                }
              />
              <button
                onClick={() => deleteSubcategory(budget._id, i)}
                className="px-2 py-1 bg-red-500 text-white rounded col-span-1"
              >
                Delete
              </button>
            </>
          ) : (
            <>
              <p>Task: {s.name}</p>
              <p>Estimated: ${s.estimatedAmount || 0}</p>
              <p>Actual: ${s.actualAmount || 0}</p>
              <div className="flex items-center gap-2">
                Vendor:{" "}
                {s.vendors?.map((vItem) => {
                  const vendor = vendors.find((v) => v._id === vItem.vendor);
                  if (!vendor) return null;

                  return vendor.avatar ? (
                    <img
                      key={vendor._id}
                      src={vendor.avatar}
                      alt={vendor.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      key={vendor._id}
                      className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-semibold"
                    >
                      {vendor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                  );
                })}
              </div>
              <p  >Vendor Amount:${s.vendors?.[0]?.amount || 0}</p>
            </>
          )}
        </div>
      ))}

      {edit && (
        <button
          onClick={() => addSubcategory(budget._id)}
          className="text-sm text-indigo-600 mt-2"
        >
          + Add Item
        </button>
      )}
    </div>
  );
};

export default BudgetCard;
