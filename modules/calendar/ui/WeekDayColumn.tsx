// modules/calendar/ui/WeekDayColumn.tsx

"use client";

import { useState } from "react";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { CalendarItem } from "../calendar.types";
import { PHASE_COLORS } from "../calendar.constants";
import { useThemeContext } from "@/context/ThemeContext";

/* ------------------------------------------------------------------ */
/* Task colors (distinct from column bg) */

const TASK_COLORS = [
  "border-blue-600 bg-blue-200/90",
  "border-yellow-600 bg-yellow-200/90",
  "border-purple-600 bg-purple-200/90",
  "border-pink-600 bg-pink-200/90",
  "border-orange-600 bg-orange-200/90",
];

function colorById(id: string) {
  return TASK_COLORS[
    id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % TASK_COLORS.length
  ];
}

/* ------------------------------------------------------------------ */

interface Vendor {
  id: string;
  name: string;
  avatar?: string;
}

interface Props {
  dayIndex: number;
  label: string;
  items: CalendarItem[];
  hours: number[];
  onQuickEdit: (item: CalendarItem) => void;
  vendorsList?: Vendor[];
  rowHeight?: number;
}

const SNAP_MINUTES = 15;
const MIN_CARD_HEIGHT = 44;

/* ------------------------------------------------------------------ */

export default function WeekDayColumn({
  dayIndex,
  label,
  items,
  hours,
  onQuickEdit,
  vendorsList = [],
  rowHeight = 40,
}: Props) {
  const { setNodeRef } = useDroppable({ id: String(dayIndex) });
  const { theme } = useThemeContext();

  /* COLUMN PHASE */
  const columnPhase = items[0]?.phase;
  const phaseMeta = columnPhase ? PHASE_COLORS[columnPhase] : null;

  /* MOUSE POSITION FOR TOOLTIP */
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);

  const snapHeight = (rowHeight / 60) * SNAP_MINUTES;
  const height = Math.max(snapHeight - 4, MIN_CARD_HEIGHT);

  return (
    <div
      ref={setNodeRef}
      id={`day-col-${dayIndex}`}
      onMouseMove={(e) => setMouse({ x: e.clientX + 12, y: e.clientY + 12 })}
      onMouseLeave={() => setMouse(null)}
      className={`relative border-l
      ${theme === "dark" ? "border-gray-700" : "border-gray-300"}
      ${phaseMeta?.bg ?? (theme === "dark" ? "bg-[#111827]" : "bg-white")}
    `}
    >
      {/* CURSOR TOOLTIP */}
      {phaseMeta && mouse && (
        <div
          style={{
            position: "fixed",
            left: mouse.x,
            top: mouse.y,
          }}
          className={`
            z-50 pointer-events-none
            px-2 py-1 rounded-md text-[11px] font-medium shadow-md
            ${phaseMeta.bg} ${phaseMeta.border} border
            transition-opacity duration-100
          `}
        >
          {phaseMeta.label}
        </div>
      )}

      {/* Header */}
      <div className={`sticky top-0 z-10 text-xs font-semibold text-center py-2
      ${theme === "dark"
        ? "bg-[#1F2937] border-b border-gray-700 text-gray-200"
        : "bg-white border-b border-gray-300 text-gray-800"}
      `}>
        {label}
      </div>

      {/* Time grid */}
      <div className="relative">
        {hours.map((h) => (
          <div
            key={h}
            className={`border-b border-dashed
              ${theme === "dark" ? "border-gray-700" : "border-gray-200"}
            `}
            style={{ height: rowHeight }}
          />
        ))}

        {items
          .filter((i) => i.startTime && !i.isFlexible)
          .map((item) => {
            const [h, m] = item.startTime!.split(":").map(Number);
            const totalMinutes = h * 60 + m;

            const pixelsPerMinute = rowHeight / 60;
            const minutesSinceStartHour = totalMinutes - hours[0] * 60;
            const snappedMinutes =
              Math.round(minutesSinceStartHour / SNAP_MINUTES) * SNAP_MINUTES;

            const top = Math.max(0, snappedMinutes * pixelsPerMinute);

            return (
              <DraggableEvent
                key={item.id}
                item={item}
                top={top}
                height={height}
                vendorsList={vendorsList}
                onQuickEdit={onQuickEdit}
              />
            );
          })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* DRAGGABLE TASK CARD */

function DraggableEvent({
  item,
  top,
  height,
  vendorsList,
  onQuickEdit,
}: {
  item: CalendarItem;
  top: number;
  height: number;
  vendorsList: Vendor[];
  onQuickEdit: (item: CalendarItem) => void;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id,
  });

  const itemVendors = vendorsList.filter((v) => item.vendors?.includes(v.id));
    const { theme } = useThemeContext();

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        top,
        height,
        transform: CSS.Translate.toString(transform),
      }}
      onDoubleClick={() => onQuickEdit(item)}
      className={`absolute left-1 right-1 rounded-lg p-2 text-xs cursor-grab
  select-none border-l-4 ${colorById(item.id)}
  ${theme === "dark"
    ? "bg-[#1F2937] text-gray-200 shadow-none hover:shadow-lg"
    : "bg-white text-gray-900 shadow-sm hover:shadow-md"}
`}
    >
      <p className="font-medium text-gray-700 truncate">{item.title}</p>

      <div className="flex justify-between items-center mt-1">
        <span  className={`text-[10px] ${
        theme === "dark" ? "text-gray-600" : "text-gray-600"
      }`}>
          {item.startTime}
          {item.endTime && ` – ${item.endTime}`}
        </span>

        {itemVendors.length > 0 && (
          <div className="flex items-center -space-x-1">
            {itemVendors.slice(0, 2).map((v) => (
              <img
                key={v.id}
                src={v.avatar || "/avatar/avatar.jpg"}
                title={v.name}
                className="w-4 h-4 rounded-full border border-white object-cover"
              />
            ))}

            {itemVendors.length > 2 && (
              <div
                className={`w-4 h-4 rounded-full border-2
                 flex items-center justify-center
                 ${theme === "dark"
                ? "bg-gray-700 text-gray-200 border-gray-600"
                : "bg-white text-gray-700 border-white"}
                text-[8px] font-medium text-gray-700`}
                title={`${itemVendors.length - 2} more`}
              >
                +{itemVendors.length - 2}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
