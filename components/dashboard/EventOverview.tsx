// components/dashboard/EventOverview.tsx

"use client";

import React, { useEffect, useState, useMemo } from "react";
import EventSelector, { EventOption } from "@/modules/budgets/ui/EventSelector";
import { BudgetItem } from "@/modules/budgets/ui/BudgetCard";
import BudgetPieChart from "@/modules/budgets/ui/BudgetPieChart";
import ActualBudgetPieChart from "@/modules/budgets/ui/ActualBudgetPieChart";
import BudgetLineChart from "@/modules/budgets/ui/BudgetLineChart";
import VendorOverview from "@/modules/budgets/ui/VendorOverview";
import { useThemeContext } from "@/context/ThemeContext";

interface EventDetails {
   _id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  isFlexible?: boolean;
  totalBudget?: number;
  clients?: { _id: string; avatar?: string; name?: string }[];
  tasksCount?: number;
}

interface Props {
  role: "admin" | "team";
}

function formatDate(date?: string) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}


export default function EventOverview({ role }: Props) {
  const [events, setEvents] = useState<EventOption[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [vendorRows, setVendorRows] = useState<any[]>([]);

  /* ---------------- Fetch Events ---------------- */
  useEffect(() => {
    fetch("/api/events")
      .then(res => res.json())
      .then(data => {
        console.log("🟢 EVENTS:", data);
        setEvents(data.map((e: any) => ({ _id: e._id, name: e.name })));
        if (data.length) setSelectedEventId(data[0]._id);
      });
  }, []);

  /* ---------------- Fetch Event Data ---------------- */
  useEffect(() => {
    if (!selectedEventId) return;

    async function load() {
      try {
        /* Event details */
        const eventRes = await fetch(`/api/events/${selectedEventId}/details`);
        const eventData = await eventRes.json();
        console.log("🟢 EVENT DETAILS:", eventData);
        setEventDetails(eventData);

        if (role === "admin") {
          /* ✅ REAL budgets for charts */
          const budgetsRes = await fetch(
            `/api/budgets/by-event?eventId=${selectedEventId}`
          );
          const budgetData = await budgetsRes.json();
          console.log("🟢 BUDGETS FOR CHARTS:", budgetData);
          setBudgets(budgetData || []);

          /* Vendor overview */
          const vendorRes = await fetch(
            `/api/budgets/vendor-overview?eventId=${selectedEventId}`
          );
          const vendorData = await vendorRes.json();
          console.log("🟣 VENDOR ROWS:", vendorData);
          setVendorRows(vendorData || []);
        }
      } catch (err) {
        console.error("EventOverview fetch error:", err);
        setBudgets([]);
        setVendorRows([]);
      }
    }

    load();
  }, [selectedEventId, role]);

  const clientNames = useMemo(
    () => eventDetails?.clients?.map(c => c.name).join(", ") || "No clients",
    [eventDetails]
  );

  return (
    <div className=" p-2 mt-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold">
          {eventDetails?.name || "Select Event"}
        </h2>
        <EventSelector
          events={events}
          selectedEvent={selectedEventId}
          onChange={setSelectedEventId}
        />
      </div>

      {/* Event Info */}
      {eventDetails && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Info label="Start Date" value={formatDate(eventDetails.startDate)}  />
          <Info label="End Date" value={formatDate(eventDetails.endDate)} />
          <Info label="Clients" value={clientNames} />
          <Info label="Tasks"  value={eventDetails.tasksCount?.toString() || "0"} />
        </div>
      )}

      {/* Charts */}
      {role === "admin" && budgets.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
            <ChartBox>
              <BudgetPieChart budgets={budgets} />
            </ChartBox>
            <ChartBox>
              <ActualBudgetPieChart budgets={budgets} />
            </ChartBox>
          </div>

          {/* <ChartBox>
            <BudgetLineChart budgets={budgets} />
          </ChartBox> */}

          {vendorRows.length > 0 && (
              <div className=" mt-32">
        <VendorOverview
          vendors={vendorRows}
          onUpdatePaid={() => {}}
        />
      </div>
          )}
        </>
      )}
    </div>
  );
}

/* ---------------- Small helpers ---------------- */

function Info({ label, value }: { label: string; value?: string }) {
    const { theme } = useThemeContext();
  return (
    <div className={`
        shadow-lg rounded-2xl p-4
        ${theme === "dark"
          ? "bg-[#374151] border border-gray-700"
          : "bg-[#F3F4F6] border border-gray-200"}
      `}>
      <p  className={`text-sm ${
          theme === "dark" ? "text-gray-400" : "text-gray-500"
        }`}>{label}</p>
      <p  className={`font-medium capitalize ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}>{value || "-"}</p>
    </div>
  );
}

function ChartBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-[320px] min-h-[320px]  rounded-xl p-4">
      {children}
    </div>
  );
}

