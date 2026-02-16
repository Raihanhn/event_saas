//modules/vendors/ui/CreateVendorModal.tsx
import { useState } from "react";

export default function CreateVendorModal({ onClose, setVendors }: any) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/vendors/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Failed to create vendor");
      }

      const newVendor = await res.json();

      // ✅ Update state immediately without reload
      setVendors((prev: any[]) => [newVendor, ...prev]);
      onClose();
      setForm({ name: "", email: "", phone: "", role: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to create vendor");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4">
        <h2 className="text-lg font-semibold">Add vendor</h2>

        {["name", "email", "phone", "role"].map((field) => (
          <input
            key={field}
            placeholder={field}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          />
        ))}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="transition transform hover:scale-105 cursor-pointer border border-gray-300 focus:outline-none rounded-lg px-4 py-2"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="bg-[#8B5CF6] hover:bg-[#7C3AED] transition transform hover:scale-105 cursor-pointer text-white px-4 py-2 rounded-lg"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
