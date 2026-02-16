// planovae/modules/events/ui/TemplatePickerModal.tsx

import { useState } from "react";
import TemplateCard from "@/modules/templates/ui/TemplateCard";
import { ITemplate } from "@/modules/templates/template.model";

interface Props {
  open: boolean;
  templates: ITemplate[];
  onClose: () => void;
  onSelect: (template: ITemplate) => void;
}

export default function TemplatePickerModal({
  open,
  templates,
  onClose,
  onSelect,
}: Props) {
  const [filter, setFilter] = useState<"all" | ITemplate["eventType"]>("all");

  if (!open) return null;

  const filteredTemplates =
    filter === "all" ? templates : templates.filter((t) => t.eventType === filter);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center pt-20">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto relative shadow-lg">
        
        {/* Header with Title + Close Icon */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Select Event Template</h2>

          {/* ✅ X Icon */}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {[
            "all",
            "wedding",
            "corporate",
            "birthday",
            "private",
            "product",
            "conference",
            "other",
          ].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t as any)}
              className={`px-3 py-1 rounded text-sm capitalize transition-colors ${
                filter === t
                  ? "bg-[#3B82F6] text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredTemplates.map((t) => (
            <TemplateCard
              key={t._id.toString()}
              template={t}
              onSelect={() => {
                onSelect(t);
                onClose();
              }}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <p className="text-center text-gray-500 mt-6">
            No templates found for this category
          </p>
        )}
      </div>
    </div>
  );
}
