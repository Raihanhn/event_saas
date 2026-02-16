// pages/client/view/[eventId].tsx

"use client";

import { useRouter } from "next/router";
import useSWR from "swr";
import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";

/* =====================
   Chart Registration
===================== */
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

/* =====================
   Fetcher
===================== */
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
};

/* =====================
   Types
===================== */
interface Subcategory {
  name: string;
  estimated: number;
  actual: number;
}

interface Budget {
  _id: string;
  category: string;
  estimatedAmount: number;
  actualAmount: number;
  subcategories: Subcategory[];
}

interface EventResponse {
  event: {
    _id: string;
    name: string;
    startDate?: string;
    endDate?: string;
    totalBudget: number;
  };
  clientName: string;
  summary: {
    totalBudget: number;
    estimatedBudget: number;
    actualSpent: number;
    remaining: number;
  };
  budgets: Budget[];
}

/* =====================
   Component
===================== */
export default function ClientEventPage() {
  const router = useRouter();
  const { eventId, token } = router.query;

  const { data, error } = useSWR<EventResponse>(
    eventId && token ? `/api/public/event/${eventId}?token=${token}` : null,
    fetcher,
  );

  const budgets = useMemo(() => data?.budgets || [], [data]);

  /* =====================
     Charts
  ====================== */
  const categoryChartData: ChartData<"bar"> = useMemo(
    () => ({
      labels: budgets.map((b) => b.category),
      datasets: [
        {
          label: "Estimated",
          data: budgets.map((b) => b.estimatedAmount),
          backgroundColor: "rgba(99,102,241,0.7)",
        },
        {
          label: "Actual",
          data: budgets.map((b) => b.actualAmount),
          backgroundColor: "rgba(16,185,129,0.7)",
        },
      ],
    }),
    [budgets],
  );

  const totalComparisonData: ChartData<"bar"> = useMemo(
    () => ({
      labels: ["Total"],
      datasets: [
        {
          label: "Estimated",
          data: [data?.summary.estimatedBudget || 0],
          backgroundColor: "rgba(99,102,241,0.7)",
        },
        {
          label: "Actual",
          data: [data?.summary.actualSpent || 0],
          backgroundColor: "rgba(16,185,129,0.7)",
        },
      ],
    }),
    [data],
  );

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
  };

  if (error) return <div className="p-10 text-red-500">Access denied</div>;
  if (!data) return <div className="p-10">Loading...</div>;

  const { event, clientName, summary } = data;

  const categoryColors = [
    "bg-indigo-300",
    "bg-purple-300",
    "bg-pink-300",
    "bg-green-300",
    "bg-yellow-300",
    "bg-blue-300",
    "bg-red-300",
  ];

  const subColors = [
    "bg-indigo-100",
    "bg-purple-100",
    "bg-pink-100",
    "bg-green-100",
    "bg-yellow-100",
    "bg-blue-100",
    "bg-red-100",
  ];

  const categoryColor = "bg-purple-300"; // For categories
  const subCategoryColor = "bg-blue-200"; // For subcategories

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* EVENT INFO */}
      <div>
        <h1 className="text-3xl font-bold">{event.name}</h1>
        <p className="text-gray-700 mt-2 capitalize font-medium">
          Client: {clientName}
        </p>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard title="Total Budget" value={summary.totalBudget} />
        <SummaryCard title="Estimated" value={summary.estimatedBudget} />
        <SummaryCard title="Actual Spent" value={summary.actualSpent} />
        <SummaryCard
          title="Remaining"
          value={summary.remaining}
          danger={summary.remaining < 0}
        />
      </div>

      {/* CHARTS */}
      <div>
        <h2 className="text-xl font-semibold mb-2">
          Estimated vs Actual (Categories)
        </h2>
        <Bar data={categoryChartData} options={chartOptions} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">
          Estimated vs Actual (Total)
        </h2>
        <Bar data={totalComparisonData} options={chartOptions} />
      </div>

      {/* =====================
         TASK / BUDGET BREAKDOWN
      ====================== */}
      <div>
        {/* <div className="flex justify-between mb-3">
          <h2 className="text-xl font-semibold">Tasks Breakdown</h2>
          <span className="text-sm text-gray-500">
            Actual / Estimated
          </span>
        </div> */}

        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Tasks Breakdown</h2>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center space-x-1">
              <span className={`w-4 h-4 ${categoryColor} rounded`}></span>
              <span>Task</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className={`w-4 h-4 ${subCategoryColor} rounded`}></span>
              <span>Subtask</span>
            </span>
            <span className="mx-4 font-medium">Actual / Estimated</span>
          </div>
        </div>

        {budgets.map((b, i) => {
          const catColor = categoryColors[i % categoryColors.length];

          return (
            <div key={b._id} className="mb-6">
              {/* CATEGORY */}

              <div
                className={`p-4 rounded shadow flex justify-between ${categoryColor}`}
              >
                <span className="font-semibold">{b.category}</span>
                <span className="font-semibold">
                  ${b.actualAmount.toLocaleString()} / $
                  {b.estimatedAmount.toLocaleString()}
                </span>
              </div>

              {/* SUBCATEGORIES */}
              {b.subcategories.length > 0 && (
                <div className="relative ml-6 mt-3 ">
                  {/* Vertical thread line */}
                  <div className="absolute  top-0 bottom-0 w-px bg-gray-300" />

                  {b.subcategories.map((s, j) => {
                    const subColor = subColors[j % subColors.length];

                    return (
                      <div className="relative flex items-start mb-2">
                        <div className="absolute left-0 top-4 w-4 h-4 border-b-2 border-gray-300 rounded-bl-lg" />
                        <div
                          className={`ml-6 p-3 rounded shadow flex justify-between w-full ${subCategoryColor}`}
                        >
                          <span>{s.name}</span>
                          <span className="font-semibold">
                            ${s.actual.toLocaleString()} / $
                            {s.estimated.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =====================
   Reusable Card
===================== */
function SummaryCard({
  title,
  value,
  danger,
}: {
  title: string;
  value: number;
  danger?: boolean;
}) {
  return (
    <div className={`p-4 rounded shadow ${danger ? "bg-red-100" : "bg-white"}`}>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-xl font-semibold">${value.toLocaleString()}</p>
    </div>
  );
}
