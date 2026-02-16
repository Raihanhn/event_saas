//modules/calendar/calendar.types.ts

export type CalendarItemType = "event" | "task";

export interface CalendarItem {
  /** UI id (event-xxx / task-xxx) */
  id: string;

  /** Original DB id */
  sourceId: string;

  type: CalendarItemType;

  title: string;

  startDate: string; // ISO
  endDate?: string;

  startTime?: string;
  endTime?: string;

  isFlexible?: boolean;

  /** vendor ids */
  vendors: string[];

  phase?: "pre-event" | "event-day" | "post-event";

  color: string;

   dueDate?: string;
}
