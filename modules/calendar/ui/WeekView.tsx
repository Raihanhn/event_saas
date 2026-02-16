// modules/calendar/ui/WeekView.tsx

"use client";

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { memo } from "react";
import { format } from "date-fns";
import WeekDayColumn from "./WeekDayColumn";
import { CalendarItem } from "../calendar.types";
import { PHASE_COLORS } from "../calendar.constants";
import { useThemeContext } from "@/context/ThemeContext";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const ROW_HEIGHT = 40;
const START_HOUR = 8;
const SNAP_MINUTES = 15;
const HOURS = Array.from({ length: 24 - START_HOUR }, (_, i) => i + START_HOUR);

function WeekView({
  items = [],
  onUpdateItem,
  onQuickEdit,
  vendorsList,
}: {
  items?: CalendarItem[];
  onUpdateItem: (item: CalendarItem) => void;
  onQuickEdit: (item: CalendarItem) => void;
  vendorsList?: { id: string; name: string; avatar?: string }[];
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );
   const { theme } = useThemeContext();

  const handleDragEnd = (e: DragEndEvent) => {
    if (!e.over) return;

    const item = items.find((i) => i.id === e.active.id);
    if (!item || !item.startDate || !item.startTime) return;

    const targetDay = Number(e.over.id);

    const startDate = new Date(item.startDate);
    const baseMinutes =
      (startDate.getHours() - START_HOUR) * 60 + startDate.getMinutes();

    const deltaMinutes =
      Math.round(((e.delta.y / ROW_HEIGHT) * 60) / SNAP_MINUTES) * SNAP_MINUTES;

    let newMinutes = Math.max(0, Math.min(1439, baseMinutes + deltaMinutes));

    const newHour = START_HOUR + Math.floor(newMinutes / 60);
    const newMinute = newMinutes % 60;

    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + (targetDay - startDate.getDay()));
    newDate.setHours(newHour, newMinute, 0, 0);

    onUpdateItem({
      ...item,
      startDate: newDate.toISOString(),
      startTime: `${String(newHour).padStart(2, "0")}:${String(
        newMinute
      ).padStart(2, "0")}`,
    });
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="overflow-x-auto">
        <div  className={`rounded-xl p-2 min-w-[900px] border
            ${
              theme === "dark"
                ? "bg-[#111827] border-gray-700 text-gray-200"
                : "bg-white border-gray-300 text-gray-900"
            }
          `}>

          {/* Phase Legend */}
          <div className="flex gap-4 mb-2">
            {Object.values(PHASE_COLORS).map((p) => (
              <div key={p.label} className="flex items-center gap-1">
                <div className={`w-3 h-3 rounded-full ${p.bg} border ${p.border}`} />
                <span  className={`text-xs ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}>{p.label}</span>
              </div>
            ))}
          </div>

          <div className="flex">
            {/* Time column */}
            <div className="w-12 shrink-0">
              <div className="h-8" />
              {HOURS.map((h) => (
                <div
                  key={h}
                  style={{ height: ROW_HEIGHT }}
                   className={`text-[10px] text-right pr-1
                    ${
                      theme === "dark"
                        ? "text-gray-400"
                        : "text-gray-500"
                    }
                  `}
                >
                  {format(new Date().setHours(h, 0, 0, 0), "h a")}
                </div>
              ))}
            </div>

            {/* Day columns */}
            <div className={`grid grid-cols-7 flex-1 rounded-lg overflow-hidden border border-l-0
                ${
                  theme === "dark"
                    ? "border-gray-700"
                    : "border-gray-200"
                }
              `}>
              {DAYS.map((label, idx) => {
                const dayItems = items.filter(
                  (i) => new Date(i.startDate).getDay() === idx
                );
                return (
                  <WeekDayColumn
                    key={idx}
                    dayIndex={idx}
                    label={label}
                    hours={HOURS}
                    items={dayItems}
                    onQuickEdit={onQuickEdit}
                    vendorsList={vendorsList}
                    rowHeight={ROW_HEIGHT}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}

export default memo(WeekView);
