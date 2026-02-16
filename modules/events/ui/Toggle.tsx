// components/Toggle.tsx
"use client";

import React from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  color?: string; // optional color for active state
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, color = "#4F46E5" }) => {
  return (
    <div className="flex items-center space-x-2">
      {label && <span className="text-gray-700">{label}</span>}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color.replace("#","")}`}
        style={{ backgroundColor: checked ? color : "#ccc" }}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          style={{ transform: checked ? "translateX(1.25rem)" : "translateX(0)" }}
        />
      </button>
    </div>
  );
};

export default Toggle;
