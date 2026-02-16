// components/dashboard/DashboardNotifications.tsx
"use client";

import { useEffect, useState } from "react";
import { useThemeContext } from "@/context/ThemeContext";

interface Client {
  _id: string;
  avatar?: string;
}

interface EventItem {
  _id: string;
  name: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  totalBudget?: number;
  status: string;
  isFlexible?: boolean;
  clients?: Client[];
  createdAt: string;
}

interface TaskItem {
  _id: string;
  title: string;
  status: string;
  event: { name: string; _id: string };
}

export default function DashboardNotifications() {
  const { theme } = useThemeContext();

  const [upcomingEvent, setUpcomingEvent] = useState<EventItem | null>(null);
  const [todaysEvents, setTodaysEvents] = useState<EventItem[]>([]);
  const [budgetAlerts, setBudgetAlerts] = useState<EventItem[]>([]);
  const [pendingTasks, setPendingTasks] = useState<TaskItem[]>([]);
  const [flexibleReminders, setFlexibleReminders] = useState<EventItem[]>([]);
  const [newEvents, setNewEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();

        if (!Array.isArray(data)) {
          setUpcomingEvent(null);
          setTodaysEvents([]);
          setBudgetAlerts([]);
          setFlexibleReminders([]);
          setNewEvents([]);
          return;
        }

        const events: EventItem[] = data;

        const now = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);

        const tomorrow = new Date();
        tomorrow.setDate(now.getDate() + 1);

        const recentEvents = events.filter(e => new Date(e.createdAt) >= weekAgo);

        const upcoming = recentEvents
          .filter(e => new Date(e.startDate) > now)
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];

        setUpcomingEvent(upcoming || null);

        setTodaysEvents(
          recentEvents.filter(e => {
            const d = new Date(e.startDate);
            return d >= now && d <= tomorrow;
          })
        );

        setBudgetAlerts(recentEvents.filter(e => e.totalBudget && e.totalBudget > 10000));
        setFlexibleReminders(recentEvents.filter(e => e.isFlexible && new Date(e.startDate) > now));

        setNewEvents(
          recentEvents.filter(
            e => now.getTime() - new Date(e.createdAt).getTime() < 48 * 60 * 60 * 1000
          )
        );

        const tasksRes = await fetch("/api/tasks?status=pending");
        const tasksData = await tasksRes.json();
        setPendingTasks(Array.isArray(tasksData) ? tasksData : []);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
        setUpcomingEvent(null);
        setTodaysEvents([]);
        setBudgetAlerts([]);
        setFlexibleReminders([]);
        setNewEvents([]);
        setPendingTasks([]);
      }
    }

    fetchNotifications();
  }, []);

  const formatDateTime = (dateStr: string, timeStr?: string) => {
    const date = new Date(dateStr);
    return `${date.toLocaleDateString()} • ${
      timeStr || date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }`;
  };

  // Dummy fallback data
  const dummyEvent: EventItem = {
    _id: "dummy",
    name: "Sample Event",
    startDate: new Date().toISOString(),
    startTime: "10:00 AM",
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const dummyTask: TaskItem = {
    _id: "dummy-task",
    title: "Sample Task",
    status: "pending",
    event: { name: "Sample Event", _id: "dummy" },
  };

  // ✅ hide dummy if ANY real data exists
  const hasRealData =
    upcomingEvent ||
    todaysEvents.length ||
    budgetAlerts.length ||
    pendingTasks.length ||
    flexibleReminders.length ||
    newEvents.length;

  return (
    <div
      className={`
        shadow-lg rounded-2xl p-6 h-full
        ${theme === "dark"
          ? "bg-[#374151] border border-gray-700"
          : "bg-[#F3F4F6] border border-gray-200"}
      `}
    >
      <h2
        className={`text-xl font-semibold mb-4 ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        Notifications
      </h2>

      {/* 🔒 ORIGINAL SCROLLBAR — NOT TOUCHED */}
      <div className="space-y-4 max-h-[calc(4*3rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {(hasRealData ? (upcomingEvent ? [upcomingEvent] : []) : [dummyEvent]).map(e => (
          <div key={e._id} className="border-l-4 border-indigo-500 pl-4">
            <p className="text-sm font-medium">Next Upcoming Event</p>
            <p className="text-xs text-gray-500">
              {e.name} • {formatDateTime(e.startDate, e.startTime)}
            </p>
          </div>
        ))}

        {(hasRealData ? todaysEvents : [dummyEvent]).map(e => (
          <div key={e._id} className="border-l-4 border-green-500 pl-4">
            <p className="text-sm font-medium">Event Today / Tomorrow</p>
            <p className="text-xs text-gray-500">
              {e.name} • {formatDateTime(e.startDate, e.startTime)}
            </p>
          </div>
        ))}

        {(hasRealData ? budgetAlerts : [dummyEvent]).map(e => (
          <div key={e._id} className="border-l-4 border-amber-500 pl-4">
            <p className="text-sm font-medium">Budget Alert</p>
            <p className="text-xs text-gray-500">
              {e.name} • Budget: ${e.totalBudget?.toLocaleString() || "5,000"}
            </p>
          </div>
        ))}

        {(hasRealData ? pendingTasks : [dummyTask]).map(t => (
          <div key={t._id} className="border-l-4 border-red-500 pl-4">
            <p className="text-sm font-medium">Pending Task</p>
            <p className="text-xs text-gray-500">
              {t.title} for {t.event.name}
            </p>
          </div>
        ))}

        {(hasRealData ? flexibleReminders : [dummyEvent]).map(e => (
          <div key={e._id} className="border-l-4 border-cyan-500 pl-4">
            <p className="text-sm font-medium">Flexible Event Reminder</p>
            <p className="text-xs text-gray-500">
              {e.name} • {formatDateTime(e.startDate, e.startTime)}
            </p>
          </div>
        ))}

        {(hasRealData ? newEvents : [dummyEvent]).map(e => (
          <div key={e._id} className="border-l-4 border-purple-500 pl-4">
            <p className="text-sm font-medium">New Event Created</p>
            <p className="text-xs text-gray-500">
              {e.name} • {formatDateTime(e.startDate, e.startTime)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
