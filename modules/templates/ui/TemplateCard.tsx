// planovae/modules/templates/ui/TemplateCard.tsx
interface Props {
  template: any;
  onSelect: () => void;
}

export default function TemplateCard({ template, onSelect }: Props) {
  return (
    <div
      onClick={onSelect}
      className="border rounded-lg p-3 cursor-pointer hover:shadow-lg transition"
    >
      <img
        src={template.image}
        className="w-full h-24 object-cover rounded mb-2"
      />
      <p className="font-medium text-center">{template.name}</p>
      <p className="text-xs text-gray-500 text-center capitalize">
        {template.eventType}
      </p>
    </div>
  );
}
