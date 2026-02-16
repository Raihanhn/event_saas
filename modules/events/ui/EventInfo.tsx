// modules/events/ui/EventInfo.tsx
"use client";
import React from "react";
import ClientsDisplay, { Client } from "./ClientsDisplay";
import { useThemeContext } from "@/context/ThemeContext";

export interface EventData {
  _id: string;
  name: string;
  eventType: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  isFlexible?: boolean;

  location?: string | null;
  status: string;
  totalBudget?: number;
  clients?: Client[];
}

interface EventInfoProps {
  eventData: EventData;
  setEventData: (data: EventData) => void;
  editMode: boolean;
  setEditMode: (val: boolean) => void;
  saveChanges: () => void;
  allClients: Client[];
}

export default function EventInfo({
  eventData,
  setEventData,
  editMode,
  setEditMode,
  saveChanges,
  allClients,
}: EventInfoProps) {
  const formatDateTime = (date?: string, time?: string) => {
    if (!date) return "—";
    return `${new Date(date).toDateString()}${time ? ` at ${time}` : ""}`;
  };

  
 const { theme } = useThemeContext();

  const inputClass = `border focus:outline-none focus:ring-0 px-2 py-1 rounded-md ${
    theme === "dark" ? "border-gray-600 bg-[#1F2937] text-white" : "border-gray-300 bg-white text-gray-900"
  }`;

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
      <div>
        {/* Event Name */}
        {editMode ? (
          <input
            value={eventData.name}
            onChange={(e) =>
              setEventData({ ...eventData, name: e.target.value })
            }
            // className="text-2xl font-semibold border focus:outline-none border-gray-300 px-1 py-0.5"
            className={inputClass + " text-2xl font-semibold "}
          />
        ) : (
          <h1 className={`text-2xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {eventData.name}
          </h1>
        )}

        {/* Clients */}
        <div className="flex-shrink-0 w-full md:w-64 lg:w-[345px] ">
          <ClientsDisplay
            clients={eventData.clients}
            allClients={allClients}
            editMode={editMode}
            setEventData={setEventData}
            eventData={eventData}
          />
        </div>

        {/* Event Type & Status */}
        <p className={`text-sm mt-1 capitalize ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          {eventData.eventType} • {eventData.status}
        </p>

        {/* Start & End Date/Time */}
        <p className={`text-sm mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          {eventData.startDate
            ? `${new Date(eventData.startDate).toDateString()}${
                eventData.startTime ? ` at ${eventData.startTime}` : ""
              }`
            : "—"}{" "}
          {" - "}{" "}
          {eventData.endDate
            ? `${new Date(eventData.endDate).toDateString()}${
                eventData.endTime ? ` at ${eventData.endTime}` : ""
              }`
            : "—"}
          {eventData.isFlexible ? " (Flexible)" : ""}
        </p>

        {/* Location */}
        <p className={`text-sm mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          Location: {eventData.location ?? "—"}
        </p>
      </div>

      {/* Buttons */}
      <div className="space-x-2 flex-shrink-0">
        {editMode ? (
          <button
            onClick={saveChanges}
            className="px-4 py-2 transition transform hover:scale-105 cursor-pointer rounded-lg bg-[#3B82F6] text-white rounded hover:bg-[#2563EB]"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2  transition transform hover:scale-105 cursor-pointer rounded-lg bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Edit Event
          </button>
        )}
      </div>
    </div>
  );
}
