// modules/calendar/calendar.constants.ts

import { CalendarItem } from "./calendar.types";

// Define the allowed phases explicitly
type Phase = NonNullable<CalendarItem["phase"]>; // "pre-event" | "event-day" | "post-event"

export const PHASE_COLORS: Record<
  Phase,
  { bg: string; border: string; label: string }
> = {
  "pre-event": {
    bg: "bg-blue-100/50",
    border: "border-blue-500",
    label: "Pre-Event",
  },
  "event-day": {
    bg: "bg-green-100/50",
    border: "border-green-500",
    label: "Event Day",
  },
  "post-event": {
    bg: "bg-purple-100/50",
    border: "border-purple-500",
    label: "Post-Event",
  },
};

/** Fallback colors for tasks with no phase */
export const DEFAULT_PHASE_COLOR = {
  bg: "bg-gray-100/50",
  border: "border-gray-400",
  label: "No Phase",
};

/**
 * Helper to safely get the phase color, even if phase is undefined
 */
export function getPhaseColor(phase?: CalendarItem["phase"]) {
  if (!phase) return DEFAULT_PHASE_COLOR;
  return PHASE_COLORS[phase];
}
