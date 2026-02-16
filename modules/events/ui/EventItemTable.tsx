// components/EventItemTable.tsx
"use client";

import React from "react";
import Select, { components } from "react-select";

export interface EventItem {
  _id: string;
  budgetId: string | null; 
  title: string;
  phase: string;
  status: string;
  dueDate: string | null;
  startTime?: string;
  endTime?: string;
  isFlexible?: boolean;
  vendors?: string[];
  estimatedAmount?: number | null;
  actualAmount?: number | null;
  event: string;
}

export interface VendorOption {
  label: string;
  value: string;
  avatar?: string;
}

interface EventItemTableProps {
  items: EventItem[];
  editMode: boolean;
  updateItem: (id: string, field: keyof EventItem | "add", value: any) => void;
  allVendors: VendorOption[];
}

// ----------------------
// Custom Vendor Option for React-Select
// ----------------------
const VendorOptionComponent = (props: any) => {
  return (
    <components.Option {...props}>
      <div className="flex items-center gap-2">
        {props.data.avatar && (
          <img
            src={props.data.avatar}
            alt={props.data.label}
            className="w-6 h-6 rounded-full object-cover"
          />
        )}
        <span>{props.data.label}</span>
      </div>
    </components.Option>
  );
};

// Custom MultiValue Label (to show avatar in selected)
const MultiValueLabel = (props: any) => (
  <components.MultiValueLabel {...props}>
    <div className="flex items-center gap-1">
      {props.data.avatar && (
        <img
          src={props.data.avatar}
          alt={props.data.label}
          className="w-4 h-4 rounded-full object-cover"
        />
      )}
      <span className="text-xs">{props.data.label}</span>
    </div>
  </components.MultiValueLabel>
);

const EventItemTable = ({
  items,
  editMode,
  updateItem,
  allVendors,
}: EventItemTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md mt-6 overflow-auto">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-300 px-4 py-2 font-semibold text-gray-700 sticky top-0 bg-white z-10">
        <span className="text-lg md:text-base">Tasks & Budgets</span>
        {editMode && (
          <button
            onClick={() =>
              updateItem(`temp-${Date.now()}`, "add", {
                _id: `temp-${Date.now()}`,
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
              })
            }
            className="text-blue-500 font-semibold hover:text-blue-700 transition text-sm md:text-xs"
          >
            + Add Item
          </button>
        )}
      </div>

      {/* Table */}
      <div className="table-scroll-wrapper">
        <table className="min-w-[1200px] w-full">
          <thead className="bg-gray-50 sticky top-0 z-50 ">
            <tr>
              <th className="px-2 py-2 text-sm px-4  text-left">Title</th>
              <th className="px-2 py-2 text-sm  text-left">Phase</th>
              <th className="px-2 py-2 text-sm  text-left">Due Date</th>
              <th className="px-2 py-2 text-sm  text-left">Start Time</th>
              <th className="px-2 py-2 text-sm  text-left">End Time</th>
              <th className="px-2 py-2 text-sm  text-left">Flexible</th>
              <th className="px-2 py-2 text-sm  text-left">Estimated</th>
              <th className="px-2 py-2 text-sm  text-left">Actual</th>
              <th className="px-2 py-2 text-sm  text-left">Status</th>
              <th className="px-2 py-2 text-sm  text-left min-w-[200px]">
                Vendors
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((i) => (
              <tr key={i._id} className="hover:bg-gray-50 transition">
                {/* Title */}
                <td className="px-4 py-1 text-sm ">
                  {editMode ? (
                    <input
                      value={i.title}
                      onChange={(e) =>
                        updateItem(i._id, "title", e.target.value)
                      }
                      className="border rounded px-2 py-1 w-full focus:ring-1 focus:ring-blue-400"
                    />
                  ) : (
                    i.title
                  )}
                </td>

                {/* Phase */}
                <td className="px-2 text-sm py-1">
                  {editMode ? (
                    <select
                      value={i.phase}
                      onChange={(e) =>
                        updateItem(i._id, "phase", e.target.value)
                      }
                      className="border rounded px-2 py-1 w-full focus:ring-1 focus:ring-blue-400"
                    >
                      <option value="pre-event">Pre-Event</option>
                      <option value="event-day">Event Day</option>
                      <option value="post-event">Post-Event</option>
                    </select>
                  ) : (
                    i.phase
                  )}
                </td>

                {/* Due Date */}
                <td className="px-2 text-sm py-1">
                  {editMode ? (
                    <input
                      type="date"
                      value={i.dueDate?.substr(0, 10) || ""}
                      onChange={(e) =>
                        updateItem(i._id, "dueDate", e.target.value)
                      }
                      className="border rounded px-2 py-1 w-full focus:ring-1 focus:ring-blue-400"
                    />
                  ) : i.dueDate ? (
                    new Date(i.dueDate).toDateString()
                  ) : (
                    "—"
                  )}
                </td>

                {/* Start / End Time */}
                <td className="px-2 text-sm py-1">
                  {editMode ? (
                    <input
                      type="time"
                      value={i.startTime || ""}
                      onChange={(e) =>
                        updateItem(i._id, "startTime", e.target.value)
                      }
                      className="border rounded px-2 py-1 w-full focus:ring-1 focus:ring-blue-400"
                    />
                  ) : (
                    i.startTime || "—"
                  )}
                </td>
                <td className="px-2 text-sm py-1">
                  {editMode ? (
                    <input
                      type="time"
                      value={i.endTime || ""}
                      onChange={(e) =>
                        updateItem(i._id, "endTime", e.target.value)
                      }
                      className="border rounded px-2 py-1 w-full focus:ring-1 focus:ring-blue-400"
                    />
                  ) : (
                    i.endTime || "—"
                  )}
                </td>

                {/* Flexible */}
                <td className="px-2 text-sm py-1 text-center">
                  {editMode ? (
                    <input
                      type="checkbox"
                      checked={i.isFlexible || false}
                      onChange={(e) =>
                        updateItem(i._id, "isFlexible", e.target.checked)
                      }
                    />
                  ) : i.isFlexible ? (
                    "✅"
                  ) : (
                    "—"
                  )}
                </td>

                {/* Estimated / Actual */}
                <td className="px-2 text-sm py-1">
                  {editMode ? (
                    <input
                      type="number"
                      value={i.estimatedAmount ?? ""}
                      onChange={(e) =>
                        updateItem(
                          i._id,
                          "estimatedAmount",
                          e.target.value === "" ? null : Number(e.target.value),
                        )
                      }
                      className="border rounded px-2 py-1 w-full focus:ring-1 focus:ring-blue-400"
                    />
                  ) : (
                    (i.estimatedAmount ?? "—")
                  )}
                </td>
                <td className="px-2 text-sm py-1">
                  {editMode ? (
                    <input
                      type="number"
                      value={i.actualAmount ?? ""}
                      onChange={(e) =>
                        updateItem(
                          i._id,
                          "actualAmount",
                          e.target.value === "" ? null : Number(e.target.value),
                        )
                      }
                      className="border rounded px-2 py-1 w-full focus:ring-1 focus:ring-blue-400"
                    />
                  ) : (
                    (i.actualAmount ?? "—")
                  )}
                </td>

                {/* Status */}
                <td className="px-2 text-sm py-1">
                  {editMode ? (
                    <select
                      value={i.status}
                      onChange={(e) =>
                        updateItem(i._id, "status", e.target.value)
                      }
                      className="border rounded px-2 py-1 w-full focus:ring-1 focus:ring-blue-400"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  ) : (
                    i.status
                  )}
                </td>

                {/* Vendors */}
                <td className="px-2 text-sm py-1 min-w-[200px] ">
                  {editMode ? (
                    <Select
                      isMulti
                      options={allVendors}
                      value={allVendors.filter((v) =>
                        i.vendors?.includes(v.value),
                      )}
                      onChange={(selected) =>
                        updateItem(
                          i._id,
                          "vendors",
                          selected.map((s: VendorOption) => s.value),
                        )
                      }
                      placeholder="Select vendors..."
                      className="w-full"
                      components={{
                        Option: VendorOptionComponent,
                        MultiValueLabel,
                      }}
                      menuPosition="fixed" // fixes clipping
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }), // make sure it's above everything
                      }}
                    />
                  ) : i.vendors && i.vendors.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {i.vendors.map((vId) => {
                        const vendor = allVendors.find((v) => v.value === vId);
                        return vendor ? (
                          <img
                            key={vId}
                            src={vendor.avatar || "/vendor-default.png"}
                            alt={vendor.label}
                            title={vendor.label}
                            className="w-6 h-6 rounded-full object-cover border"
                          />
                        ) : null;
                      })}
                    </div>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventItemTable;
