// components/EventCards.tsx
"use client";

import React from "react";
import { useThemeContext } from "@/context/ThemeContext";

export interface EventCardProps {
  label: string;
  value?: string | number | boolean | React.ReactNode;
  timeValue?: string;
  checked?: boolean;
  editMode: boolean;
  onChange?: (...args: any[]) => void;
  color?: string;
  isCheckbox?: boolean;
  selectOptions?: string[];
  isNumber?: boolean;
}

// Modern toggle component for checkbox
const Toggle = ({ checked = false, onChange, color = "#4F46E5" }: { checked?: boolean; onChange?: (val: boolean) => void; color?: string }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
      style={{ backgroundColor: checked ? color : "#ccc" }}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        style={{ transform: checked ? "translateX(1.25rem)" : "translateX(0)" }}
      />
    </button>
  );
};

const EventCard = ({
  label,
  value,
  timeValue,
  checked,
  editMode,
  onChange,
  color,
  isCheckbox,
  selectOptions,
  isNumber,
}: EventCardProps) => {

  const { theme } = useThemeContext();

  return (
    <div className={`relative overflow-hidden rounded-lg shadow p-4 flex flex-col space-y-2 ${theme === "dark" ? " bg-gray-800 text-white" : " text-gray-900"}`}>
      {/* Top curved triangle */}
      {color && (
        <span
          className="absolute top-0 right-0 w-6 h-6 clip-triangle-curved"
          style={{ backgroundColor: color }}
        ></span>
      )}

      {/* Label */}
      <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`}>{label}</p>

      {/* Editable Content */}
      {editMode ? (
        <>
          {isCheckbox ? (
            <Toggle checked={checked} onChange={(val) => onChange?.(val)} color={color} />
          ) : selectOptions ? (
            <select
              value={value as string}
              onChange={(e) => onChange?.(e.target.value)}
              className={`border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 ${theme === "dark" ? "border-gray-600 bg-[#1F2937] text-white focus:ring-indigo-500" : "border-gray-300 bg-white text-gray-900 focus:ring-blue-400"}`}
            >
              {selectOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ) : isNumber ? (
            <input
              type="number"
              value={value as number | string | undefined}
              onChange={(e) => onChange?.(e.target.value)}
              className={`border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 ${theme === "dark" ? "border-gray-600 bg-[#1F2937] text-white focus:ring-indigo-500" : "border-gray-300 bg-white text-gray-900 focus:ring-blue-400"}`}
            />
          ) : typeof value === "string" && timeValue !== undefined ? (
            <div className="flex flex-col space-y-1">
              <input
                type="date"
                value={(value as string).substr(0, 10)}
                onChange={(e) => onChange?.(e.target.value, timeValue)}
                className={`border rounded px-2 py-1 w-full focus:outline-none calendar-white focus:ring-2 ${theme === "dark" ? "border-gray-600 bg-[#1F2937] text-white focus:ring-indigo-500" : "border-gray-300 bg-white text-gray-900 focus:ring-blue-400"}`}
              />
              <input
                type="time"
                value={timeValue || ""}
                onChange={(e) => onChange?.(value, e.target.value)}
                className={`border rounded px-2 py-1 w-full focus:outline-none calendar-white focus:ring-2 ${theme === "dark" ? "border-gray-600 bg-[#1F2937] text-white focus:ring-indigo-500" : "border-gray-300 bg-white text-gray-900 focus:ring-blue-400"}`}
              />
            </div>
          ) : (
            <input
              type="text"
              value={value as string | undefined}
              onChange={(e) => onChange?.(e.target.value)}
              className={`border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 ${theme === "dark" ? "border-gray-600 bg-[#1F2937] text-white focus:ring-indigo-500" : "border-gray-300 bg-white text-gray-900 focus:ring-blue-400"}`}
            />
          )}
        </>
      ) : (
        // Display mode
        <p className="font-medium">
          {isCheckbox
            ? checked
              ? "✅"
              : "—"
            : timeValue
            ? `${new Date(value as string).toDateString()} at ${timeValue}`
            : value || "—"}
        </p>
      )}
    </div>
  );
};

export default EventCard;
