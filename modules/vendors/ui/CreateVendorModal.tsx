//modules/vendors/ui/CreateVendorModal.tsx
import { useState } from "react";
import { useThemeContext } from "@/context/ThemeContext";

export default function CreateVendorModal({ onClose, setVendors }: any) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const { theme } = useThemeContext();

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
      <div className={`w-full max-w-md rounded-xl p-6 space-y-4
          ${
            theme === "dark"
              ? "bg-[#1F2937] text-white"
              : "bg-white text-gray-900"
          }
        `}>
        <h2 className="text-lg font-semibold">Add vendor</h2>

        {["name", "email", "phone", "role"].map((field) => (
          <input
            key={field}
            placeholder={field}
            className={`w-full rounded-lg px-3 py-2 outline-none border
              ${
                theme === "dark"
                  ? "bg-[#111827] border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900"
              }
            `}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          />
        ))}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className={`transition transform hover:scale-105 cursor-pointer rounded-lg px-4 py-2 border
              ${
                theme === "dark"
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700"
              }
            `}
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
