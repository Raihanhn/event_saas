// modules/budgets/ui/BudgetLineChart.tsx
"use client";

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { BudgetItem } from "./BudgetCard";

interface Props {
  budgets: BudgetItem[];
}

const BudgetLineChart: React.FC<Props> = ({ budgets }) => {
  // Prepare timeline data
  const data = useMemo(() => {
    if (!budgets.length) {
      return [{ name: "Start", projected: 0, actual: 0 }];
    }

    // Aggregate per budget category
    const rows: {
      name: string;
      projected: number;
      actual: number;
    }[] = [];

    budgets.forEach((b, index) => {
      rows.push({
        name: b.category || `Category ${index + 1}`,
        projected: Number(b.estimatedAmount ?? 0),
        actual: Number(b.actualAmount ?? 0),
      });
    });

    // Convert to cumulative totals (IMPORTANT for line chart)
    let cumulativeProjected = 0;
    let cumulativeActual = 0;

    return rows.map((r) => {
      cumulativeProjected += r.projected;
      cumulativeActual += r.actual;

      return {
        name: r.name,
        projected: cumulativeProjected,
        actual: cumulativeActual,
      };
    });
  }, [budgets]);

  console.log("BudgetLineChart data:", data);

  return (
    <div className="bg-white rounded-2xl shadow p-4 my-4">
      <h2 className="text-lg font-semibold mb-2">Actual vs Projected Spend</h2>

      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              dataKey="name"
              tick={{
                fill: "#6b7280",
                fontSize: 12,
                fontWeight: 500,
                textAnchor: "end",
              }}
            />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="projected"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 5 }}
            />

            <Line
              type="monotone"
              dataKey="actual"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BudgetLineChart;
