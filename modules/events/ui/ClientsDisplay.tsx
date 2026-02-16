// modules/events/ui/ClientsDisplay.tsx

"use client";

import React from "react";
import Select, {
  components,
  OptionProps,
  ValueContainerProps,
} from "react-select";
import { EventData } from "./EventInfo";
import { useThemeContext } from "@/context/ThemeContext";

/* ================================
   Types
================================ */
export interface Client {
  _id: string;
  name: string;
  avatar?: string;
}

interface ClientsDisplayProps {
  clients?: Client[];
  editMode: boolean;
  setEventData: (data: EventData) => void;
  eventData: EventData;
  allClients: Client[];
}
 

/* ================================
   Custom Option (Checkbox + Avatar)
================================ */
const CheckboxOption = (props: OptionProps<any>) => {
  const { theme } = useThemeContext();
  return (
    <components.Option {...props}>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={props.isSelected}
          readOnly
          className={`w-4 h-4 ${theme === "dark" ? "accent-white" : "accent-black"}`}
        />
        <img
          src={props.data.avatar || "/default-avatar.png"}
          alt={props.label}
          className="w-7 h-7 rounded-full object-cover"
        />
        <span className={`text-sm ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          {props.label}
        </span>
      </div>
    </components.Option>
  );
};

/* ================================
   Custom Value Container
   ✔ Avatar only
   ✔ Max 2 + "+N"
   ✔ Correct outside click handling
================================ */
const CustomValueContainer = (props: ValueContainerProps<any>) => {
  const selected = props.getValue();

  return (
    <components.ValueContainer
      {...props}
      innerProps={{
        ...props.innerProps,
        className: "flex items-center gap-1 pl-2",
      }}
    >
      {selected.length === 0 && props.children}

      {selected.length > 0 &&
        selected.slice(0, 2).map((item: any) => (
          <img
            key={item.value}
            src={item.avatar || "/default-avatar.png"}
            className="w-6 h-6 rounded-full object-cover"
          />
        ))}

      {selected.length > 2 && (
        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-xs font-medium">
          +{selected.length - 2}
        </div>
      )}
    </components.ValueContainer>
  );
};

/* ================================
   Component
================================ */
export default function ClientsDisplay({
  clients = [],
  editMode,
  setEventData,
  eventData,
  allClients = [],
}: ClientsDisplayProps) {
     const { theme } = useThemeContext();
  /* ---------- VIEW MODE ---------- */
  if (!editMode) {
    if (!clients.length) return null;

    if (clients.length === 1) {
      return (
        <div className="flex items-center mt-2">
          <img
            src={clients[0].avatar || "/default-avatar.png"}
            alt={clients[0].name}
            className="w-8 h-8 rounded-full mr-2 object-cover"
          />
          <span className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{clients[0].name}</span>
        </div>
      );
    }

    return (
      <div className="flex flex-col mt-2">
        <div className="flex -space-x-2">
          {clients.slice(0, 3).map((c) => (
            <img
              key={c._id}
              src={c.avatar || "/default-avatar.png"}
              alt={c.name}
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
            />
          ))}
          {clients.length > 3 && (
            <span className="w-8 h-8 flex items-center justify-center text-xs bg-gray-200 rounded-full border-2 border-white">
              +{clients.length - 3}
            </span>
          )}
        </div>

        <div className={`mt-1 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
          {clients.map((c) => c.name).join(", ")}
        </div>
      </div>
    );
  }

  /* ---------- EDIT MODE ---------- */
  return (
    <div className="mt-2">
      <p className={`text-sm mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`}>Clients</p>

      <Select
  isMulti
  closeMenuOnSelect={false}
  blurInputOnSelect={false}
  closeMenuOnScroll
  hideSelectedOptions={false}
  placeholder="Select clients..."
  className="text-sm"
  menuPortalTarget={typeof document !== "undefined" ? document.body : undefined} // fix dropdown portal
  options={allClients.map((c) => ({
    value: c._id,
    label: c.name,
    avatar: c.avatar,
  }))}
  value={clients.map((c) => ({
    value: c._id,
    label: c.name,
    avatar: c.avatar,
  }))}
  components={{
    Option: CheckboxOption,
    ValueContainer: CustomValueContainer,
    MultiValue: () => null,
  }}
  onChange={(selected) => {
    const selectedClients: Client[] = (selected as any[]).map((s) => ({
      _id: s.value,
      name: s.label,
      avatar: s.avatar,
    }));

    setEventData({
      ...eventData,
      clients: selectedClients,
    });
  }}
  styles={{
    control: (base) => ({
      ...base,
      minHeight: "40px",
      borderRadius: "8px",
      borderColor: theme === "dark" ? "#374151" : "#d1d5db",
      backgroundColor: theme === "dark" ? "#1F2937" : "#fff",
      color: theme === "dark" ? "#fff" : "#111827",
      boxShadow: "none",
      ":hover": { borderColor: theme === "dark" ? "#6B7280" : "#9ca3af" },
    }),
    input: (base) => ({
      ...base,
      color: theme === "dark" ? "#fff" : "#111827",
    }),
    placeholder: (base) => ({
      ...base,
      color: theme === "dark" ? "#9CA3AF" : "#6B7280",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? theme === "dark"
          ? "#374151"
          : "#f3f4f6"
        : theme === "dark"
        ? "#1F2937"
        : "#fff",
      color: theme === "dark" ? "#fff" : "#111827",
      cursor: "pointer",
      padding: "10px",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: theme === "dark" ? "#1F2937" : "#fff",
      color: theme === "dark" ? "#fff" : "#111827",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
      backgroundColor: theme === "dark" ? "#1F2937" : "#fff",
      color: theme === "dark" ? "#fff" : "#111827",
    }),
  }}
/>

    </div>
  );
}
