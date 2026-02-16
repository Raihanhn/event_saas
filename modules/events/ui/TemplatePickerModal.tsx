// planovae/modules/events/ui/TemplatePickerModal.tsx

import { useState } from "react";
import TemplateCard from "@/modules/templates/ui/TemplateCard";
import { ITemplate } from "@/modules/templates/template.model";
import { useThemeContext } from "@/context/ThemeContext";

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
  const { theme } = useThemeContext();

  const filteredTemplates =
    filter === "all" ? templates : templates.filter((t) => t.eventType === filter);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center pt-20">
      <div  className={`rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto relative shadow-lg ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}>
        
        {/* Header with Title + Close Icon */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Select Event Template</h2>

          {/* ✅ X Icon */}
          <button
            onClick={onClose}
             className={`transition-colors cursor-pointer ${
              theme === "dark" ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"
            }`}
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
                  : theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
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
          <p className={`text-center mt-6 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            No templates found for this category
          </p>
        )}
      </div>
    </div>
  );
}
