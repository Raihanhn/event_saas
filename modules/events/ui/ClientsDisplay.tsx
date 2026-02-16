// modules/events/ui/ClientsDisplay.tsx

// modules/events/ui/ClientsDisplay.tsx

"use client";

import React from "react";
import Select, {
  components,
  OptionProps,
  ValueContainerProps,
} from "react-select";
import { EventData } from "./EventInfo";

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
const CheckboxOption = (props: OptionProps<any>) => (
  <components.Option {...props}>
    <div className="flex items-center gap-3">
      <input
        type="checkbox"
        checked={props.isSelected}
        readOnly
        className="w-4 h-4 accent-black"
      />
      <img
        src={props.data.avatar || "/default-avatar.png"}
        alt={props.label}
        className="w-7 h-7 rounded-full object-cover"
      />
      <span className="text-sm">{props.label}</span>
    </div>
  </components.Option>
);

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
          <span className="text-sm font-medium">{clients[0].name}</span>
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

        <div className="mt-1 text-sm text-gray-700">
          {clients.map((c) => c.name).join(", ")}
        </div>
      </div>
    );
  }

  /* ---------- EDIT MODE ---------- */
  return (
    <div className="mt-2">
      <p className="text-sm text-gray-500 mb-1">Clients</p>

      <Select
        isMulti
        closeMenuOnSelect={false}
        blurInputOnSelect={false}
        closeMenuOnScroll
        hideSelectedOptions={false}
        placeholder="Select clients..."
        className="text-sm"
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
            borderColor: "#d1d5db",
            boxShadow: "none",
            ":hover": { borderColor: "#9ca3af" },
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? "#f3f4f6" : "#ffffff",
            color: "#111827",
            cursor: "pointer",
            padding: "10px",
          }),
          placeholder: (base) => ({
            ...base,
            paddingLeft: "8px",
          }),
        }}
      />
    </div>
  );
}
