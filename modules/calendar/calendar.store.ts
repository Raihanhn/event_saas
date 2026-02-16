// planovae/modules/calendar/calendar.store.ts

import { create } from "zustand";
import { CalendarItem, CalendarItemType } from "./calendar.types";

interface CalendarState {
  items: CalendarItem[];
  setItems: (items: CalendarItem[]) => void;
  upsertItem: (item: CalendarItem) => void;
  removeBySource: (sourceId: string) => void;
  clear: () => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
  upsertItem: (item) =>
    set((state) => {
      const exists = state.items.find((i) => i.id === item.id);
      if (exists) {
        return { items: state.items.map((i) => (i.id === item.id ? item : i)) };
      }
      return { items: [...state.items, item] };
    }),
   removeBySource: (sourceId) =>
    set((state) => ({
      items: state.items.filter((i) => i.sourceId !== sourceId),
    })),
  clear: () => set({ items: [] }),
}));

