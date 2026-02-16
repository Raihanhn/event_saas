// modules/teams/ui/EditModal.tsx
import { useState } from "react";

type EditTeamModalProps = {
  member: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    location?: string;
    permissions?: {
      canEditVendor: boolean;
    };
  };
  onClose: () => void;
};

export default function EditTeamModal({ member, onClose }: EditTeamModalProps) {
  const [form, setForm] = useState({
    name: member.name,
    email: member.email,
    phone: member.phone || "",
    location: member.location || "",
    canEditVendor: member.permissions?.canEditVendor ?? false,
  });

  const submit = async () => {
    await fetch(`/api/teams/${member._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
        location: form.location,
        permissions: {
          canEditVendor: form.canEditVendor,
        },
      }),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-5">
        <h2 className="text-lg font-semibold">Manage team member</h2>

        {/* Name */}
        <input
          placeholder="Name"
          value={form.name}
          className="w-full border rounded-lg px-3 py-2"
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        {/* Email */}
        <input
          placeholder="Email"
          value={form.email}
          className="w-full border rounded-lg px-3 py-2"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        {/* Phone */}
        <input
          placeholder="Phone"
          value={form.phone}
          className="w-full border rounded-lg px-3 py-2"
          onChange={e => setForm({ ...form, phone: e.target.value })}
        />

        {/* Location */}
        <input
          placeholder="Location"
          value={form.location}
          className="w-full border rounded-lg px-3 py-2"
          onChange={e => setForm({ ...form, location: e.target.value })}
        />

        {/* Permissions */}
        <div className="pt-2">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Vendor Permission
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                setForm({ ...form, canEditVendor: true })
              }
              className={`px-3 py-1 rounded-lg text-sm border transition transform hover:scale-105 cursor-pointer
                ${
                  form.canEditVendor
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }
              `}
            >
              Yes
            </button>

            <button
              type="button"
              onClick={() =>
                setForm({ ...form, canEditVendor: false })
              }
              className={`px-3 py-1 rounded-lg text-sm border transition transform hover:scale-105 cursor-pointer
                ${
                  !form.canEditVendor
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }
              `}
            >
              No
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="text-gray-600 transition transform hover:scale-105 cursor-pointer border border-gray-300 px-4 py-2 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-4 py-2 rounded-lg transition transform hover:scale-105 cursor-pointer"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
