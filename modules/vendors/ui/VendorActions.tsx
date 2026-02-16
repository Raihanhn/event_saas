//modules/vendors/ui/VendorActions.tsx

"use client";
import { useState } from "react";

export default function VendorActions({ vendor, onEdit, onDelete }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="p-2 rounded hover:bg-gray-100 cursor-pointer "
      >
        ⋮

        {/* Action buttons dropdown */}
        {open && (
          <div className="absolute -mt-7 mr-4 right-0 w-28  bg-white border border-gray-300 rounded-lg shadow p-2 flex justify-between">
            <span
               onClick={() => onEdit(vendor)}
              className="text-gray-700 cursor-pointer  hover:text-gray-900"
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
