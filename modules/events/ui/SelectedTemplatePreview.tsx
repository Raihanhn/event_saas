// planovae/modules/events/ui/SelectedTemplatePreview.tsx
export default function SelectedTemplatePreview({ template }: any) {
  return (
    <div className="flex items-center gap-4 border rounded p-3 bg-gray-50">
      <img src={template.image} className="w-16 h-16 rounded object-cover" />
      <div>
        <p className="font-medium">{template.name}</p>
        <p className="text-xs text-gray-500 capitalize">
          {template.eventType}
        </p>
      </div>
    </div>
  );
}
