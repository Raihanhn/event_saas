// planovae/modules/common/Label.tsx
export default function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-sm font-medium text-gray-600 block mb-1">
      {children}
    </label>
  );
}
