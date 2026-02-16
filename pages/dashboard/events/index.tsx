// pages/dashboard/events/index.tsx

import { useState } from "react";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import { requireAuthServerSide } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Client from "@/modules/clients/client.model";
import Event from "@/modules/events/event.model";
import { useThemeContext } from "@/context/ThemeContext";
import mongoose from "mongoose";

/* ================= TYPES ================= */

interface EventItem {
  _id: string;
  name: string;
  eventType: string;
  startDate: string;
  status: string;
  totalBudget?: number;
  clients?: {
    _id: string;
    avatar?: string;
  }[];
}

interface EventsPageProps {
  events: EventItem[];
  user: {
    id: string;
    organization: string;
    role: string;
  };
}

/* ================= PAGE ================= */

export default function Events({
  events,
  role,
}: EventsPageProps & { role: string }) {
  const [search, setSearch] = useState("");
  const [eventList, setEventList] = useState(events);

  const filteredEvents = eventList.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()),
  );
  console.log("Filtered Events:", filteredEvents);
  console.log("Event List State:", eventList);
  const { theme } = useThemeContext();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Failed to delete event");
        return;
      }

      setEventList((prev) => prev.filter((e) => e._id !== id));
      alert("Event deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete event");
    }
  };

  return (
    <div   className={`p-6 space-y-6 h-screen ${
        theme === "dark" ? " text-white" : " text-gray-900"
      }`}>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Events</h1>

        {/* Search + Button */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
             className={`border rounded-lg px-4 py-2 w-full md:w-72 focus:outline-none
              ${
                theme === "dark"
                  ? "bg-[#1F2937] border-gray-700 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }
            `}
          />

          {role === "admin" && (
            <Link href="/dashboard/events/create">
              <button className="px-4 py-2 transition transform hover:scale-105 cursor-pointer rounded-lg bg-[#3B82F6] text-white rounded hover:bg-[#2563EB]">
                + Create Event
              </button>
            </Link>
          )}
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className={`flex flex-col items-center border rounded-lg justify-center py-20 space-y-6
            ${theme === "dark" ? "border-gray-700" : "border-gray-300"}
          `}>
          <svg
            className="w-16 h-16 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17v-6h6v6m-6 0h6m-3-3V4m0 0L9 7m3-3l3 3"
            />
          </svg>
          <h2  className={`text-xl font-semibold ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}>
            No events created yet
          </h2>
          <p className={`text-center ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}>
            Start by creating your first event to get things rolling.
          </p>
        </div>
      ) : (
        <div
          className={`rounded-2xl border overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] ${
            theme === "dark"
              ? "bg-[#1F2937] border-gray-700"
              : "bg-[#F3F4F6] border-gray-200/60 backdrop-blur-md"
          }`}
        >
          <table className="w-full text-sm">
            <thead className={`${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}>
              <tr>
                <th className="px-6 py-4 text-left font-medium">Name</th>
                <th className="px-6 py-4 text-left font-medium">Clients</th>
                <th className="px-6 py-4 text-left font-medium">Type</th>
                <th className="px-6 py-4 text-left font-medium">Start Date</th>
                {/* <th className="px-6 py-4 text-left font-medium">Budget</th> */}
                {role === "admin" && (
                  <th className="px-6 py-4 text-left font-medium">Budget</th>
                )}
                <th className="px-6 py-4 text-left font-medium">Status</th>
                {role === "admin" && (
                  <th className="px-6 py-4 text-left font-medium">Actions</th>
                )}
                {/* <th className="px-6 py-4 text-left font-medium">Actions</th> */}
              </tr>
            </thead>

            <tbody>
              {filteredEvents.map((event) => (
                <tr
                  key={event._id}
                   className={`border-t transition ${
                    theme === "dark"
                      ? "border-gray-700 hover:bg-gray-800"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <td className={`px-6 py-4 font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}>
                    {event.name}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex -space-x-2">
                      {event.clients?.slice(0, 3).map((c) => (
                        <img
                          key={c._id}
                          src={c.avatar || "/default-avatar.png"}
                          className="w-7 h-7 rounded-full border-2 border-white"
                          alt=""
                        />
                      ))}

                      {event.clients && event.clients.length > 3 && (
                        <span className="w-7 h-7 flex items-center justify-center text-xs bg-gray-200 rounded-full border-2 border-white">
                          +{event.clients.length - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className={`px-6 py-4 capitalize ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}>
                    {event.eventType}
                  </td>

                  <td  className={`px-6 py-4 font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-800"
                      }`}>
                    {new Date(event.startDate).toLocaleDateString()}
                  </td>

                  {/* <td className="px-6 py-4 font-medium text-gray-800">
                    ${event.totalBudget?.toLocaleString() ?? 0}
                  </td> */}

                  {role === "admin" && (
                    <td  className={`px-6 py-4 font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-800"
                      }`}>
                      ${event.totalBudget?.toLocaleString() ?? 0}
                    </td>
                  )}

                  <td className={`px-6 py-4 capitalize ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}>
                    {event.status}
                  </td>

                  {role === "admin" && (
                   <td className="px-6 py-4 text-right">
                    <div className="relative group inline-block">
                      {/* Vertical icon */}
                      <button className={`p-1 rounded-full transition ${
                            theme === "dark"
                              ? "hover:bg-gray-700 text-gray-300"
                              : "hover:bg-gray-200 text-gray-500"
                          }`}>
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                        </svg>
                      </button>

                      {/* Hover menu */}
                      <div
                        className={`absolute right-5 -mt-9 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition z-20
                            ${
                              theme === "dark"
                                ? "bg-[#1F2937] border border-gray-700 text-white"
                                : "bg-white border border-gray-200 text-gray-900"
                            }
                          `}
                      >
                        <div className="flex items-center gap-4 px-4 py-2">
                          <Link href={`/dashboard/events/${event._id}`}>
                            <span className="text-sm  hover:underline cursor-pointer">
                              View
                            </span>
                          </Link>

                          <span
                            onClick={() => handleDelete(event._id)}
                            className="text-sm text-red-600 hover:underline cursor-pointer"
                          >
                            Delete
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  )}

                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
         <div className="h-56"></div>
    </div>
  );
}

/* ================= SSR ================= */

export const getServerSideProps: GetServerSideProps = requireAuthServerSide(
  async (context) => {
    await connectDB();

    const events = await Event.find({
      organization: context.user!.organization,
    })
      .sort({ startDate: -1 })
      .lean();

    // 2️⃣ Collect client IDs
    const clientIds = events
      .flatMap((e: any) => e.clients || [])
      .filter(Boolean);

    // 3️⃣ Fetch clients separately
    const clients = await Client.find(
      { _id: { $in: clientIds } },
      "avatar name email",
    ).lean();

    // 4️⃣ Create lookup map
    const clientMap = new Map(clients.map((c: any) => [c._id.toString(), c]));

    // 5️⃣ Merge safely
    const mappedEvents = events.map((e: any) => ({
      _id: e._id.toString(),
      name: e.name,
      eventType: e.eventType,
      startDate: e.startDate.toISOString(),
      status: e.status,
      totalBudget: e.totalBudget ?? 0,
      clients:
        e.clients
          ?.map((id: any) => {
            const c = clientMap.get(id.toString());
            return c
              ? {
                  _id: c._id.toString(),
                  avatar: c.avatar || "/avatar/avatar.jpg",
                }
              : null;
          })
          .filter(Boolean) || [],
    }));

    return {
      props: {
        events: mappedEvents,
        user: context.user,
        role: context.user!.role,
      },
    };
  },
);
