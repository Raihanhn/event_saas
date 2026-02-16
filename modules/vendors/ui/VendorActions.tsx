//modules/vendors/ui/VendorActions.tsx

"use client";
import { useState } from "react";
import { useThemeContext } from "@/context/ThemeContext";

export default function VendorActions({ vendor, onEdit, onDelete }: any) {
  const [open, setOpen] = useState(false);
  const { theme } = useThemeContext();

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className={`p-2 rounded cursor-pointer
          ${
            theme === "dark"
              ? "hover:bg-gray-700 text-gray-300"
              : "hover:bg-gray-100 text-gray-700"
          }
        `}
      >
        ⋮

        {/* Action buttons dropdown */}
        {open && (
          <div className={`absolute -mt-7 mr-4 right-0 w-28 rounded-lg shadow p-2 flex justify-between border
              ${
                theme === "dark"
                  ? "bg-[#1F2937] border-gray-600"
                  : "bg-white border-gray-300"
              }
            `}>
            <span
               onClick={() => onEdit(vendor)}
              className={`cursor-pointer
                ${
                  theme === "dark"
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-gray-900"
                }
              `}
            >
              Edit
            </span>
            <span
              onClick={() => onDelete(vendor._id)}
              className="text-red-600 cursor-pointer hover:text-red-800"
            >
              Delete
            </span>
          </div>
        )}
      </button>
    </div>
  );
}
