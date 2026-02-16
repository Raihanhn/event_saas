// modules/calendar/ui/MonthView.tsx

"use client";

import { CalendarItem } from "../calendar.types";
import { startOfMonth, startOfWeek, addDays, format } from "date-fns";
import { PHASE_COLORS } from "../calendar.constants";
import { useThemeContext } from "@/context/ThemeContext";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  DragEndEvent,
  closestCenter,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

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

function dateKey(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().split("T")[0]; // "2026-01-29"
}

function DraggableTask({ task }: { task: CalendarItem }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={`rounded-md px-1.5 py-1 text-[11px] cursor-grab
        border-l-4 shadow-sm select-none
        ${colorById(task.id)}
      `}
    >
      <p className="truncate">{task.title}</p>
    </div>
  );
}

export default function MonthView({
  items,
  onUpdateItem,
}: {
  items: CalendarItem[];
  onUpdateItem?: (item: CalendarItem) => void;
}) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const weekStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const days = Array.from({ length: 42 }, (_, i) => addDays(weekStart, i));
    const { theme } = useThemeContext();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  const handleDragEnd = (e: DragEndEvent) => {
    if (!e.over || !onUpdateItem) return;

    const draggedItem = items.find((i) => i.id === e.active.id);
    if (!draggedItem) return;

    const targetDateKey = e.over.id as string;
    const targetDate = new Date(targetDateKey);

    // Keep existing startTime if present
    if (draggedItem.startTime) {
      const [h, m] = draggedItem.startTime.split(":").map(Number);
      targetDate.setHours(h, m, 0, 0);
    } else {
      targetDate.setHours(0, 0, 0, 0);
    }

    onUpdateItem({ ...draggedItem, startDate: targetDate.toISOString() });
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
       <div className={`overflow-hidden border rounded-lg
          ${theme === "dark" ? "border-gray-600" : "border-gray-300"}
        `}>
      <div className="grid grid-cols-7 grid-rows-6 ">
        {days.map((day) => {
          const key = dateKey(day);
          const { setNodeRef, isOver } = useDroppable({ id: key });

          // ✅ Get tasks for this day
          const dayTasks = items.filter(
            (i) => i.startDate && dateKey(i.startDate) === key
          );

          // ✅ Determine phase and background color
          const dayPhase = dayTasks[0]?.phase ?? null; // pick first task's phase
          const dayBg = dayPhase ? PHASE_COLORS[dayPhase].bg : "bg-white";

          return (
            <div
              key={key}
              ref={setNodeRef}
              className={`relative min-h-[110px] p-1 pointer-events-auto
                  ${dayBg}
                  ${
                    isOver
                      ? theme === "dark"
                        ? "bg-blue-900/40"
                        : "bg-blue-100"
                      : ""
                  }
                  ${
                    theme === "dark"
                      ? "border border-gray-700 text-white"
                      : "border border-gray-200 text-gray-900"
                  }
                `}
            >
              {/* Date */}
              <div className={`text-xs font-medium mb-1
                    ${theme === "dark" ? "text-gray-300" : "text-gray-700"}
                  `}>{format(day, "d")}</div>

              {/* Tasks */}
              <div className="space-y-1">
                {dayTasks.map((task) => (
                  <DraggableTask key={task.id} task={task} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </DndContext>
  );
}
