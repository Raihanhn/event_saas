// modules/budgets/ui/BudgetPieChart.tsx

"use client";

import React, { useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Label, Legend } from "recharts";
import { motion } from "framer-motion";
import { BudgetItem } from "./BudgetCard";
import { useThemeContext } from "@/context/ThemeContext";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"];

interface Props {
  budgets: BudgetItem[];
}

const BudgetPieChart: React.FC<Props> = ({ budgets }) => {
  const { theme } = useThemeContext();
  const chartData = useMemo(
    () => budgets.map(b => ({ name: b.category, value: b.estimatedAmount || 0 })),
    [budgets]
  );
  const total = chartData.reduce((sum, b) => sum + b.value, 0);

  if (chartData.length === 0) return <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>No budget data to display.</p>;

  /* =======================
     Outer Value Labels
  ======================= */
  const CustomValueLabel = (props: any) => {
    const RADIAN = Math.PI / 180;
    const radius = props.outerRadius + 20;
    const x = props.cx + radius * Math.cos(-props.midAngle * RADIAN);
    const y = props.cy + radius * Math.sin(-props.midAngle * RADIAN);

    return (
      <motion.g
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.35,
          delay: props.index * 0.08,
          type: "spring",
          stiffness: 220,
        }}
      >
        <circle cx={x} cy={y} r={14} fill={COLORS[props.index % COLORS.length]} />
        <text
          x={x}
          y={y}
          fill="#ffffff"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={11}
          fontWeight={600}
        >
          {props.value >= 1000 ? `${Math.round(props.value / 1000)}k` : props.value}
        </text>
      </motion.g>
    );
  };

  /* =======================
     Center Label
  ======================= */
  const CenterLabel = ({ viewBox }: any) => {
    const { cx, cy, width } = viewBox;
     const valueSize =
    Number.isFinite(width) && width > 0 ? Math.min(22, width / 10) : 12;

    return (
      <g>
        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          fill={theme === "dark" ? "#E5E7EB" : "#111827"}
          fontSize={12}
          fontWeight={500}
          opacity={0.85}
        >
          Total Budget
        </text>
        <text
          x={cx}
          y={cy + 16}
          textAnchor="middle"
           fill={theme === "dark" ? "#FFFFFF" : "#111827"}
          fontSize={valueSize}
          fontWeight={700}
        >
          ${total.toLocaleString()}
        </text>
      </g>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`
        rounded-2xl shadow p-4 w-full h-80 sm:h-96 my-4
        ${theme === "dark"
          ? "bg-[#374151] border border-gray-700"
          : "bg-[#F3F4F6] border border-gray-200"}
      `}
    >
      <h2 className={`text-lg font-semibold mb-2 ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}>Estimated Overview</h2>
      <ResponsiveContainer width="100%" height="100%" minHeight={200} >
        <PieChart>
          <Tooltip
            formatter={(value: number | undefined) =>
              value !== undefined ? `$${value.toLocaleString()}` : "$0"
            }
            contentStyle={{
              backgroundColor: theme === "dark" ? "#1F2937" : "#f9fafb",
              borderRadius: 8,
              border:
                theme === "dark"
                  ? "1px solid #374151"
                  : "1px solid #e5e7eb",
              color: theme === "dark" ? "#F9FAFB" : "#111827",
            }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="top"
            align="center"
            iconType="circle"
            wrapperStyle={{ marginBottom: 12, color: theme === "dark" ? "#E5E7EB" : "#374151", }}
          
          />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name" // <-- this is your legend key
            innerRadius={60}
            outerRadius={95}
            paddingAngle={5}
            isAnimationActive={false}
            label={CustomValueLabel}
            labelLine={false}
          >
            <Label content={CenterLabel} />
            {chartData.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default BudgetPieChart;



