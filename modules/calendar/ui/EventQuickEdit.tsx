// modules/calendar/ui/EventQuickEdit.tsx

"use client";

import { useEffect, useState } from "react";
import { CalendarItem } from "../calendar.types";
import Select from "react-select";
import { useThemeContext } from "@/context/ThemeContext";

export default function EventQuickEdit({
  item,
  allVendors,
  onSave,
  onDelete,
  onClose,
  onVendorChange,
}: {
  item: CalendarItem;
  allVendors: { id: string; name: string; avatar?: string }[];
  onSave: (item: CalendarItem) => void;
  onDelete: () => void;
  onClose: () => void;
  onVendorChange: (taskId: string, newVendors: string[]) => void;
}) {
  const [localItem, setLocalItem] = useState<CalendarItem>({
    ...item,
    vendors: [...(item.vendors ?? [])],
  });
  const [loading, setLoading] = useState(false);
  console.log("ITEM RECEIVED:", item);

  const { theme } = useThemeContext();


  // Sync props to local state whenever item changes
  useEffect(() => {
    setLocalItem({
      ...item,
      vendors: [...(item.vendors ?? [])],
    });
  }, [item]);

  // Debug: see selected vendors
  useEffect(() => {
    console.log("Local item vendors:", localItem.vendors);
  }, [localItem.vendors]);

  const handleSave = async () => {
    setLoading(true);
    try {
      onSave(localItem);
      onClose();
    } catch (e) {
      console.error("Quick edit save failed", e);
      alert("Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    setLoading(true);
    try {
      onDelete();
    } finally {
      setLoading(false);
      onClose();
    }
  };

  // Get selected options from localItem.vendors
  const selectedVendors = allVendors
    .filter((v) => localItem.vendors?.includes(v.id))
    .map((v) => ({ value: v.id, label: v.name }));

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className={`relative rounded-xl p-6 w-[480px] max-h-[80vh] overflow-y-auto space-y-4
          ${theme === "dark" ? "bg-[#1F2937] text-white" : "bg-white text-gray-900"}
        `}>
        {loading && (
          <div className={`absolute inset-0 flex items-center justify-center z-50 rounded-xl
              ${theme === "dark" ? "bg-black/60" : "bg-white/70"}
            `}>
            <p className="text-sm ">Saving...</p>
          </div>
        )}

        <h3 className="font-semibold text-sm">Quick Edit</h3>

        {/* Title */}
        <input
          value={localItem.title}
          onChange={(e) =>
            setLocalItem((p) => ({ ...p, title: e.target.value }))
          }
          className={`border rounded px-2 py-1 w-full text-sm outline-none
            ${
              theme === "dark"
                ? "bg-[#374151] border-gray-600 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900"
            }
          `}
        />

        {/* Time */}
        <div className="flex gap-2">
          <input
            type="time"
            value={localItem.startTime || ""}
            onChange={(e) =>
              setLocalItem((p) => ({ ...p, startTime: e.target.value }))
            }
            className={`border rounded px-2 py-1 w-full text-sm outline-none
              ${
                theme === "dark"
                  ? "bg-[#374151] border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }
            `}
          />
          <input
            type="time"
            value={localItem.endTime || ""}
            onChange={(e) =>
              setLocalItem((p) => ({ ...p, endTime: e.target.value }))
            }
            className={`border rounded px-2 py-1 w-full text-sm outline-none
              ${
                theme === "dark"
                  ? "bg-[#374151] border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }
            `}
          />
        </div>

        {/* Vendors */}
        <div>
          <p className={`text-xs mb-1 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}>Select Vendors</p>
          <Select
            isMulti
            options={allVendors.map((v) => ({ value: v.id, label: v.name }))}
            value={selectedVendors}
            onChange={(selectedOptions) => {
              const vendorIds = Array.isArray(selectedOptions)
                ? selectedOptions.map((opt) => opt.value)
                : [];

              console.log(
                "Vendor changed for task",
                localItem.title,
                vendorIds,
              );

              // Update local state instantly
              setLocalItem((prev) => ({ ...prev, vendors: vendorIds }));

              // Update parent state & backend
              onVendorChange(localItem.sourceId, vendorIds);
            }}
            placeholder="Select vendors..."
            className="text-sm"
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor:
                  theme === "dark" ? "#374151" : "#ffffff",
                borderColor:
                  theme === "dark" ? "#4B5563" : "#D1D5DB",
                color: theme === "dark" ? "#ffffff" : "#111827",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor:
                  theme === "dark" ? "#1F2937" : "#ffffff",
                color: theme === "dark" ? "#ffffff" : "#111827",
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor:
                  theme === "dark" ? "#4B5563" : "#E5E7EB",
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: theme === "dark" ? "#ffffff" : "#111827",
              }),
            }}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-2">
          <button
            onClick={handleDelete}
            className="text-red-500 text-sm transition transform hover:scale-105 cursor-pointer"
            disabled={loading}
          >
            Delete
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className={`text-sm opacity-70 transition transform hover:scale-105 cursor-pointer
                ${theme === "dark" ? "text-gray-300" : "text-gray-700"}
              `}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white rounded px-3 py-1 text-sm transition transform hover:scale-105 cursor-pointer"
              disabled={loading}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
