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
import { useThemeContext } from "@/context/ThemeContext";
import { BudgetItem } from "./BudgetCard";

interface Props {
  budgets: BudgetItem[];
}

const BudgetLineChart: React.FC<Props> = ({ budgets }) => {
  const { theme } = useThemeContext();

  // Prepare chart data
  const data = useMemo(() => {
    if (!budgets.length) return [{ name: "Start", projected: 0, actual: 0 }];

    const rows: { name: string; projected: number; actual: number }[] = [];

    budgets.forEach((b, index) => {
      rows.push({
        name: b.category || `Category ${index + 1}`,
        projected: Number(b.estimatedAmount ?? 0),
        actual: Number(b.actualAmount ?? 0),
      });
    });

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

  // Define theme colors
  const colors = {
    background: theme === "dark" ? "#1F2937" : "#F3F4F6",
    text: theme === "dark" ? "#F3F4F6" : "#111827",
    grid: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
    projected: "#10b981",
    actual: "#4f46e5",
  };

  return (
    <div
      className={`rounded-2xl shadow p-4 my-4 transition-colors`}
      style={{ backgroundColor: colors.background }}
    >
      <h2
        className="text-lg font-semibold mb-2"
        style={{ color: colors.text }}
      >
        Actual vs Projected Spend
      </h2>

      <div className="w-full h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fill: colors.text, fontSize: 12, fontWeight: 500, textAnchor: "end" }}
              interval={0}
            />
            <YAxis
              tick={{ fill: colors.text, fontSize: 12, fontWeight: 500 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#374151" : "#f9fafb",
                border: "none",
                borderRadius: "0.5rem",
                color: colors.text,
              }}
            />
            <Legend
              wrapperStyle={{ color: colors.text, fontWeight: 500 }}
            />

            <Line
              type="monotone"
              dataKey="projected"
              stroke={colors.projected}
              strokeWidth={3}
              dot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke={colors.actual}
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

