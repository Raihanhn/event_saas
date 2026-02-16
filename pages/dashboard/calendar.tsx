// planovae/pages/dashboard/calendar.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useCalendarStore } from "@/modules/calendar/calendar.store";
import EventQuickEdit from "@/modules/calendar/ui/EventQuickEdit";
import { CalendarItem } from "@/modules/calendar/calendar.types";
import { useThemeContext } from "@/context/ThemeContext";

const WeekView = dynamic(() => import("@/modules/calendar/ui/WeekView"), {
  ssr: false,
});
const MonthView = dynamic(() => import("@/modules/calendar/ui/MonthView"), {
  ssr: false,
});

export default function CalendarPage() {
  const { upsertItem } = useCalendarStore();
  const { theme } = useThemeContext();
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"week" | "month">("week");
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<string>("");

  const [eventsData, setEventsData] = useState<any[]>([]);
  const [tasksData, setTasksData] = useState<any[]>([]);
  const [allVendors, setAllVendors] = useState<
    { id: string; name: string; avatar?: string }[]
  >([]);
  const [editingItem, setEditingItem] = useState<CalendarItem | null>(null);

  // 🔄 Load events, tasks, vendors
  useEffect(() => {
    async function loadCalendar() {
      setLoading(true);
      try {
        const [eventsRes, tasksRes, vendorsRes] = await Promise.all([
          fetch("/api/calendar/events"),
          fetch("/api/tasks"),
          fetch("/api/vendors"),
        ]);

        if (!eventsRes.ok || !tasksRes.ok || !vendorsRes.ok)
          throw new Error("API fetch failed");

        const [events, tasks, vendors] = await Promise.all([
          eventsRes.json(),
          tasksRes.json(),
          vendorsRes.json(),
        ]);

        // ✅ Normalize vendors here
        const normalizedVendors = vendors.map((v: any) => ({
          id: v._id, // use _id from backend
          name: v.name,
          avatar: v.avatar,
          // avatar: v.avatar,
        }));

        console.log("VENDORS RAW FROM API:", vendors);

        const normalizedTasks = tasks.map((t: any) => ({
          ...t,
          vendors: Array.isArray(t.vendors)
            ? t.vendors.map((v: any) =>
                typeof v === "string" ? v : String(v._id),
              )
            : [],
        }));

        setEventsData(events);
        // setTasksData(tasks);
        setTasksData(normalizedTasks);
        setAllVendors(normalizedVendors);

        // 🔹 default: latest event
        const newestEvent = [...events].sort(
          (a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
        )[0];

        if (newestEvent) setSelectedEvent(newestEvent._id);
      } catch (err) {
        console.error("Calendar load failed:", err);
        setEventsData([]);
        setTasksData([]);
        setAllVendors([]);
      } finally {
        setLoading(false);
      }
    }
    loadCalendar();
  }, []);

  // 🔹 Prepare displayed tasks only for selected event
  const displayedItems: CalendarItem[] = useMemo(() => {
    if (!selectedEvent) return [];

    const eventTasks = tasksData.filter(
      (t) => t.event?._id?.toString() === selectedEvent,
    );

    let filtered = eventTasks;

    console.log("Tasks raw:", filtered);

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter((item) => {
        if ((item.title || "").toLowerCase().includes(q)) return true;
        if (item.vendors) {
          return item.vendors.some((vid: string) => {
            const vendor = allVendors.find((v) => v.id === vid);
            return vendor?.name.toLowerCase().includes(q);
          });
        }
        return false;
      });
    }

    const mapped: CalendarItem[] = filtered.map((i) => ({
      id: `task-${i._id}`,
      sourceId: i._id,
      type: "task",
      title: i.title,
      startDate: i.startDate ?? i.dueDate ?? "",
      endDate: i.endDate,
      startTime: i.startTime ?? "",
      endTime: i.endTime ?? "",
      isFlexible: !!i.isFlexible,
      vendors:
        i.vendors?.map((v: any) => (typeof v === "string" ? v : v._id)) ?? [],
      phase: i.phase,
      color: "green",
    }));

    return mapped;
  }, [selectedEvent, tasksData, search, allVendors]);

  // CalendarPage
  const handleVendorChange = (taskId: string, newVendors: string[]) => {
    setTasksData((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, vendors: newVendors } : t)),
    );

    console.log("Updated vendors in state:", newVendors);

    fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vendors: newVendors }),
    }).catch(console.error);
  };

  // 🔹 Update task instantly & backend
  const handleUpdateItem = async (item: CalendarItem) => {
    upsertItem(item);

    setTasksData((prev) =>
      prev.map((t) =>
        t._id === item.sourceId
          ? {
              ...t,
              startDate: item.startDate,
              startTime: item.startTime,
              endTime: item.endTime,
            }
          : t,
      ),
    );

    try {
      await fetch(`/api/tasks/${item.sourceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: item.title,
          dueDate: item.startDate,
          startTime: item.startTime,
          endTime: item.endTime,
          isFlexible: item.isFlexible,
          vendors: item.vendors,
          color: item.color,
        }),
      });
    } catch (e) {
      console.error("Update failed:", e);
    }
  };

  // 🔹 Delete task
  const handleDeleteItem = async (item: CalendarItem) => {
    upsertItem({ ...item, startDate: "", title: "" });
    setEditingItem(null);
    setTasksData((prev) => prev.filter((t) => t._id !== item.sourceId));

    try {
      await fetch(`/api/tasks/${item.sourceId}`, { method: "DELETE" });
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };


  return (
    <div className={`${theme === "dark" ? " text-white" : " text-gray-900"} space-y-4 h-screen`}>
      {/* Header */}
      <div className={`flex flex-col gap-4 border-b pb-4 ${theme === "dark" ? "border-gray-600" : "border-gray-300"}`}>
        {/* Title + Date */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">Calendar</h1>
            <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"} text-sm`}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Event selector */}
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
             className={`h-9 rounded-md border px-3 text-sm ${
              theme === "dark"
                ? "bg-[#374151] border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            {eventsData.map((e) => (
              <option key={e._id} value={e._id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search */}
          <input
            placeholder="Search tasks or vendors…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`h-9 w-full sm:w-64 rounded-md border px-3 text-sm ${
              theme === "dark"
                ? "bg-[#374151] border-gray-600 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            }`}
          />

          {/* View toggle */}
          <div className={`flex rounded-md border overflow-hidden ${theme === "dark" ? "border-gray-600" : "border-gray-300"}`}>
            {["week", "month"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v as any)}
                 className={`px-4 h-9 text-sm transition transform hover:scale-105 cursor-pointer ${
                  view === v
                    ? "bg-blue-600 text-white"
                    : theme === "dark"
                    ? "bg-[#374151] text-white hover:bg-[#4B5563]"
                    : "bg-white hover:bg-gray-100 text-gray-900"
                }`}
              >
                {v === "week" ? "Week" : "Month"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar */}
      {view === "week" ? (
        <WeekView
          items={displayedItems}
          onUpdateItem={handleUpdateItem}
          onQuickEdit={setEditingItem}
          vendorsList={allVendors}
        />
      ) : (
        <MonthView
          items={displayedItems}
          onUpdateItem={handleUpdateItem}
          // vendorsList={allVendors}
        />
      )}

      {/* Quick edit modal */}
      {editingItem && (
        <EventQuickEdit
          item={editingItem}
          allVendors={allVendors}
          onSave={handleUpdateItem}
          onDelete={() => handleDeleteItem(editingItem)}
          onClose={() => setEditingItem(null)}
          onVendorChange={handleVendorChange}
        />
      )}
    </div>
  );
}
