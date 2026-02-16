// planovae/modules/events/ui/CustomEventFields.tsx
import { useState } from "react";
import { EventItem } from "./EventItemTable";
import { useThemeContext } from "@/context/ThemeContext";

interface CustomEventFieldsProps {
  items: EventItem[];
  setItems: (items: EventItem[]) => void;
}

export default function CustomEventFields({ items, setItems }: CustomEventFieldsProps) {
  // Add new task/budget
  const addItem = () => {
    const newItem: EventItem = {
      _id: `temp-${Date.now()}`,
      budgetId: null,  
      title: "",
      phase: "pre-event",
      status: "pending",
      dueDate: null,
      startTime: "",
      endTime: "",
      isFlexible: false,
      vendors: [],
      estimatedAmount: null,
      actualAmount: null,
      event: "",
    };
    setItems([...items, newItem]);
  };

  const { theme } = useThemeContext();

  // Update a field in an item
  const updateItem = (id: string, field: keyof EventItem, value: any) => {
    setItems(items.map((i) => (i._id === id ? { ...i, [field]: value } : i)));
  };

  // Remove an item
  const removeItem = (id: string) => {
    setItems(items.filter((i) => i._id !== id));
  };

  return (
    <div className={`border rounded-lg p-4 space-y-3 ${theme === "dark" ? "border-gray-700 bg-[#111827] text-white" : "border-gray-300 bg-white text-gray-900"}`}>
      <h3 className="font-semibold">Custom Event Setup</h3>

      {items.map((item) => (
        <div key={item._id} className="flex flex-col md:flex-row gap-2 items-start md:items-center">
          <input
            className={`flex-1 border px-3 py-2 rounded ${theme === "dark" ? "border-gray-600 bg-[#1F2937] text-white" : "border-gray-300 bg-white text-gray-900"}`}
            placeholder="Task / Budget title"
            value={item.title}
            onChange={(e) => updateItem(item._id, "title", e.target.value)}
          />

          <select
             className={`border px-2 py-1 rounded ${theme === "dark" ? "border-gray-600 bg-[#1F2937] text-white" : "border-gray-300 bg-white text-gray-900"}`}
            value={item.phase}
            onChange={(e) => updateItem(item._id, "phase", e.target.value)}
          >
            <option value="pre-event">Pre-Event</option>
            <option value="event-day">Event Day</option>
            <option value="post-event">Post-Event</option>
          </select>

          <input
            type="number"
            placeholder="Estimated Amount"
            className={`px-2 py-1 rounded w-28 border ${theme === "dark" ? "border-gray-600 bg-[#1F2937] text-white" : "border-gray-300 bg-white text-gray-900"}`}
            value={item.estimatedAmount ?? ""}
            onChange={(e) =>
              updateItem(
                item._id,
                "estimatedAmount",
                e.target.value === "" ? null : Number(e.target.value)
              )
            }
          />

          <button
            type="button"
            className={`font-semibold px-2 py-1 rounded border transition ${theme === "dark" ? "text-red-400 border-red-500 hover:bg-red-600/20" : "text-red-500 border-red-500 hover:bg-red-50"}`}
            onClick={() => removeItem(item._id)}
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="px-4 py-2 transition transform hover:scale-105 cursor-pointer rounded-lg bg-[#3B82F6] text-white rounded hover:bg-[#2563EB]"
      >
        + Add Task
      </button>

      <p className={`text-xs mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
        You can add tasks and budgets now, and edit them after creating the event.
      </p>
    </div>
  );
}
