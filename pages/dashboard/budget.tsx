// pages/dashboard/budget.tsx

import { useEffect, useState, useMemo } from "react";
import EventSelector, { EventOption } from "@/modules/budgets/ui/EventSelector";
import BudgetCard, {
  BudgetItem,
  Subcategory,
} from "@/modules/budgets/ui/BudgetCard";
import BudgetPieChart from "@/modules/budgets/ui/BudgetPieChart";
import BudgetLineChart from "@/modules/budgets/ui/BudgetLineChart";
import VendorOverview from "@/modules/budgets/ui/VendorOverview";
import ActualBudgetPieChart from "@/modules/budgets/ui/ActualBudgetPieChart";
import { useThemeContext } from "@/context/ThemeContext";

interface EventDetails {
  _id: string;
  name: string;
  totalBudget: number;
  clients: { name: string; avatar?: string }[];
}

interface VendorOption {
  _id: string;
  name: string;
}

interface VendorRow {
  vendorId: string;
  name: string;
  avatar?: string;
  task: string;
  totalCost: number;
  paid: number;
  budgetId: string;
  subcategoryName: string;
}

export default function BudgetPage() {
  const [events, setEvents] = useState<EventOption[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [vendors, setVendors] = useState<VendorOption[]>([]);
  const [loading, setLoading] = useState(false);
  const { theme } = useThemeContext();

  // -----------------------
  // Fetch events & vendors
  // -----------------------
  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data || []);
        if (data?.length > 0) setSelectedEvent(data[0]._id);
      })
      .catch(() => setEvents([]));

    fetch("/api/vendors")
      .then((res) => res.json())
      .then(setVendors)
      .catch(() => setVendors([]));
  }, []);

  // -----------------------
  // Fetch budgets & event details
  // -----------------------

  useEffect(() => {
    if (!selectedEvent) return;

    setLoading(true);
    Promise.all([
      fetch(`/api/budgets/by-event?eventId=${selectedEvent}`).then((r) =>
        r.json(),
      ),
      fetch(`/api/events/${selectedEvent}/details`).then((r) => r.json()),
    ])
      .then(([budgetData, eventData]) => {
        setBudgets(budgetData || []);
        setEventDetails(eventData);
      })
      .finally(() => setLoading(false));
  }, [selectedEvent]);

  /* ---------------- Budget Mutations ---------------- */

  const updateBudget = async (id: string, payload: Partial<BudgetItem>) => {
    setBudgets((prev) =>
      prev.map((b) => (b._id === id ? { ...b, ...payload } : b)),
    );

    await fetch(`/api/budgets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };

  const addSubcategory = async (budgetId: string) => {
    setBudgets((prev) =>
      prev.map((b) =>
        b._id === budgetId
          ? {
              ...b,
              subcategories: [
                ...(b.subcategories || []),
                { name: "", estimatedAmount: 0, actualAmount: 0, vendors: [] },
              ],
            }
          : b,
      ),
    );
  };

  const updateSubcategory = async (
    budgetId: string,
    index: number,
    field: keyof Subcategory,
    value: any,
  ) => {
    // Update state immediately
    let updatedBudget: BudgetItem | undefined;

    setBudgets((prev) =>
      prev.map((b) => {
        if (b._id === budgetId) {
          const newSubcategories = b.subcategories?.map((s, i) =>
            i === index ? { ...s, [field]: value } : s,
          );
          updatedBudget = { ...b, subcategories: newSubcategories };
          return updatedBudget;
        }
        return b;
      }),
    );

    if (!updatedBudget) return;

    // Save to backend
    await fetch(`/api/budgets/${budgetId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subcategories: updatedBudget.subcategories }),
    });
  };

  const deleteBudget = async (budgetId: string) => {
    // Remove from state immediately
    setBudgets((prev) => prev.filter((b) => b._id !== budgetId));

    // Delete from backend
    await fetch(`/api/budgets/${budgetId}`, {
      method: "DELETE",
    });
  };

  const deleteSubcategory = async (budgetId: string, index: number) => {
    let updatedBudget: BudgetItem | undefined;

    setBudgets((prev) =>
      prev.map((b) => {
        if (b._id === budgetId) {
          const newSubcategories = b.subcategories?.filter(
            (_, i) => i !== index,
          );
          updatedBudget = { ...b, subcategories: newSubcategories };
          return updatedBudget;
        }
        return b;
      }),
    );

    if (!updatedBudget) return;

    await fetch(`/api/budgets/${budgetId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subcategories: updatedBudget.subcategories }),
    });
  };

  // -----------------------
  // Summary for top cards
  // -----------------------
  const summary = useMemo(() => {
    const totalBudget = eventDetails?.totalBudget || 0;
    const actualSpent = budgets.reduce(
      (sum, b) => sum + (b.actualAmount || 0),
      0,
    );
    const projected = budgets.reduce(
      (sum, b) => sum + (b.estimatedAmount || 0),
      0,
    );
    const remaining = totalBudget - actualSpent;
    const spentPercent = totalBudget
      ? Math.min(Math.round((actualSpent / totalBudget) * 100), 100)
      : 0;
    return { totalBudget, actualSpent, projected, remaining, spentPercent };
  }, [budgets, eventDetails]);

  // -----------------------
  // Dummy fallback cards
  // -----------------------
  const dummyCards = [
    { title: "Total Budget", value: "$50,000" },
    { title: "Projected Budget", value: "$45,000" },
    { title: "Actual Spent", value: "$38,200" },
    { title: "Remaining / Overrun", value: "$11,800" },
  ];

  const updateVendorPaid = async (row: VendorRow, paid: number) => {
    await fetch(`/api/budgets/${row.budgetId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subcategoryVendorUpdate: {
          subcategoryName: row.subcategoryName,
          vendorId: row.vendorId,
          amount: paid,
        },
      }),
    });
  };

  const vendorOverviewData: VendorRow[] = useMemo(() => {
    const rows: VendorRow[] = [];

    budgets.forEach((b) => {
      b.subcategories?.forEach((s) => {
        s.vendors?.forEach((v) => {
          const vendor = vendors.find(
            (vd) => vd._id.toString() === v.vendor.toString(),
          );
          if (!vendor) return;

          rows.push({
            vendorId: v.vendor,
            name: vendor.name,
            avatar: (vendor as any).avatar,
            task: s.name,
            totalCost: s.actualAmount || 0,
            paid: v.amount || 0,
            budgetId: b._id,
            subcategoryName: s.name,
          });
        });
      });
    });

    return rows;
  }, [budgets, vendors]);

  if (loading || !selectedEvent || !eventDetails) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading budgets…
      </div>
    );
  }

  return (
    <div
      className={`p-6 h-screen space-y-6
        ${theme === "dark" ? "bg-[#111827] text-gray-200" : "bg-white text-gray-900"}
      `}
    >
      {/* <h1 className="text-2xl font-semibold">Event Budgets</h1> */}

      {/* Top Header Row */}
      {/* ===================== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Title */}
        <h1 className="text-2xl font-semibold ">Event Budgets</h1>

        {/* Right: Event Selector */}
        <EventSelector
          events={events}
          selectedEvent={selectedEvent}
          onChange={setSelectedEvent}
        />
      </div>

      {/* Clients Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {eventDetails && (
          <div
            className={`flex items-center gap-2 p-2 rounded-xl shadow
            ${theme === "dark" ? "bg-[#1F2937]" : "bg-gray-50"}
          `}
          >
            <span className=" font-medium opacity-70">Clients:</span>

            {eventDetails?.clients?.map((c, idx) => (
              <div key={idx} className="flex items-center gap-2 capitalize">
                {/* Avatar */}
                {c.avatar ? (
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-semibold">
                    {c.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                )}
                {/* Name */}
                <span className="font-medium ">{c.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ------------------ */}
      {/* Top Summary Cards */}
      {/* ------------------ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {(eventDetails
          ? [
              {
                title: "Total Budget",
                value: `$${summary.totalBudget.toLocaleString()}`,
              },
              {
                title: "Projected Budget",
                value: `$${summary.projected.toLocaleString()}`,
              },
              {
                title: "Actual Spent",
                value: `$${summary.actualSpent.toLocaleString()}`,
              },
              {
                title: "Remaining / Overrun",
                value: `$${summary.remaining.toLocaleString()}`,
              },
            ]
          : dummyCards
        ).map((c, idx) => (
          <div
            key={idx}
            className={` ${theme === "dark" ? "bg-[#1F2937]" : "bg-[#F3F4F6]"} rounded-2xl shadow p-4 flex flex-col justify-between`}
          >
            <p className="opacity-70">{c.title}</p>
            <p className="text-xl font-bold mt-2">{c.value}</p>
            {c.title === "Actual Spent" && eventDetails && (
              <div className="mt-2 w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    summary.spentPercent > 100
                      ? "bg-red-500"
                      : summary.spentPercent > 75
                        ? "bg-yellow-400"
                        : "bg-green-500"
                  }`}
                  style={{ width: `${summary.spentPercent}%` }}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ------------------ */}
      {/* Event Details */}
      {/* ------------------ */}

      {/* {loading && <p className="text-gray-500">Loading budgets…</p>} */}

      {/* ------------------ */}
      {/* Charts */}
      {/* ------------------ */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BudgetPieChart budgets={budgets.length > 0 ? budgets : []} />
        <ActualBudgetPieChart budgets={budgets.length > 0 ? budgets : []} />
      </div>
      <BudgetLineChart budgets={budgets.length > 0 ? budgets : []} />

      {/* Budget Cards */}
      {/* {loading && <p>Loading…</p>} */}
      {(budgets.length ? budgets : []).map((b) => (
        <BudgetCard
          key={b._id}
          budget={b}
          updateBudget={updateBudget}
          addSubcategory={addSubcategory}
          updateSubcategory={updateSubcategory}
          deleteSubcategory={deleteSubcategory}
          deleteBudget={deleteBudget}
          vendors={vendors}
        />
      ))}

      {/* ------------------ */}
      {/* Vendor Overview */}
      {/* ------------------ */}
      <VendorOverview
        vendors={vendorOverviewData}
        onUpdatePaid={updateVendorPaid}
      />

      <div className="h-56"></div>
    </div>
  );
}
