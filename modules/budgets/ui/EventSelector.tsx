// modules/budgets/ui/EventSelector.tsx
"use client";

import React from "react";

export interface EventOption {
  _id: string;
  name: string;
}

interface EventSelectorProps {
  events: EventOption[];
  selectedEvent: string | null;
  onChange: (id: string) => void;
}

const EventSelector: React.FC<EventSelectorProps> = ({
  events,
  selectedEvent,
  onChange,
}) => {
  return (
    <select
      value={selectedEvent || ""}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded-lg px-3 py-2 w-full sm:w-64"
    >
      {events.map((event) => (
        <option key={event._id} value={event._id}>
          {event.name}
        </option>
      ))}
    </select>
  );
};

export default EventSelector;
