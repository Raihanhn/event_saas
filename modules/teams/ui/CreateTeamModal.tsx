//modules/teams/ui/CreateTeamModal.tsx
import { useState } from "react";

export default function CreateTeamModal({ onClose }: any) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", location: "", password: "" });

  const submit = async () => {
    await fetch("/api/teams/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4">
        <h2 className="text-lg font-semibold">Invite team member</h2>

        {["name", "email", "phone", "location", "password"].map(field => (
          <input
            key={field}
            placeholder={field}
            type={field === "password" ? "password" : "text"}
            className="w-full border rounded-lg px-3 py-2"
            onChange={e => setForm({ ...form, [field]: e.target.value })}
          />
        ))}

        <div className="flex justify-end gap-3 ">
          <button className="transition transform hover:scale-105 cursor-pointer border border-gray-300 px-4 py-2 rounded-lg" onClick={onClose}>Cancel</button>
          <button
            onClick={submit}
            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-4 py-2 rounded-lg transition transform hover:scale-105 cursor-pointer"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
