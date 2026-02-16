// planovae/modules/events/ui/SelectedTemplatePreview.tsx
import { useThemeContext } from "@/context/ThemeContext";

export default function SelectedTemplatePreview({ template }: any) {
  const { theme } = useThemeContext();
  return (
    <div className={`flex items-center gap-4 border rounded p-3 ${
        theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-[#F3F4F6] border-gray-200"
      }`}>
      <img src={template.image} className="w-16 h-16 rounded object-cover" />
      <div>
        <p className={`${theme === "dark" ? "text-white" : "text-gray-900"} font-medium`}>{template.name}</p>
        <p  className={`text-xs capitalize ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}>
          {template.eventType}
        </p>
      </div>
    </div>
  );
}
