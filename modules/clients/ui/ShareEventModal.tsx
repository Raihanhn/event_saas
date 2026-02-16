// modules/clients/ui/ShareEventModal.tsx

import { useEffect, useState } from "react";
import { X, Copy } from "lucide-react";
import { useThemeContext } from "@/context/ThemeContext";

export default function ShareEventModal({ client, onClose }: any) {
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");
  const [link, setLink] = useState("");
     const { theme } = useThemeContext();

  useEffect(() => {
    if (!client) return;

    fetch(`/api/clients/${client._id}/assigned-events`)
      .then(res => res.json())
      .then(setEvents);
  }, [client]);

  async function generateLink() {
    if (!eventId) return alert("Select event");

    const res = await fetch(
      `/api/clients/share/${client._id}?eventId=${eventId}`,
      { method: "POST", credentials: "include" }
    );

    const data = await res.json();
    setLink(data.link);
  }

  function copyLink() {
    if (!link) return;
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
  }

  if (!client) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div  className={`p-6 rounded-lg w-[400px] space-y-4 relative
          ${theme === "dark" ? "bg-[#1F2937] text-white" : "bg-[#F3F4F6] text-gray-900"}
        `}>
        {/* X Close Icon */}
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 
            ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800"}
          `}
          title="Close"
        >
          <X size={20} />
        </button>

        <h3 className="font-semibold text-lg">Share Event</h3>

        <select
          className={`w-full border p-2 rounded-md
            ${theme === "dark" ? "bg-[#374151] border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}
          `}
          value={eventId}
          onChange={e => setEventId(e.target.value)}
        >
          <option value="">Select event</option>
          {events.map((e: any) => (
            <option key={e._id} value={e._id}>
              {e.name}
            </option>
          ))}
        </select>

        <button
          onClick={generateLink}
          className="w-full bg-pink-500 text-white p-2 rounded-md"
        >
          Generate Link
        </button>

        {link && (
          <div className={`flex items-center justify-between text-sm break-all p-2 rounded
              ${theme === "dark" ? "bg-[#374151] text-white" : "bg-gray-100 text-gray-900"}
            `}>
            <span className="truncate">{link}</span>
            <button
              onClick={copyLink}
              className={`ml-2 cursor-pointer
                ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800"}
              `}
              title="Copy link"
            >
              <Copy size={16} />
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className={`w-full border p-2 rounded-md
            ${theme === "dark" ? "border-gray-600 bg-[#374151] hover:bg-[#4B5563] text-white" : "border-gray-300 bg-white hover:bg-gray-100 text-gray-900"}
          `}
        >
          Close
        </button>
      </div>
    </div>
  );
}
