// modules/clients/ui/CreateClientModal.tsx
import { useState, useEffect } from "react";
import { useThemeContext } from "@/context/ThemeContext";

export default function CreateClientModal({
  open,
  setOpen,
  setClients,
  client, // optional, if editing
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  setClients: any;
  client?: any; // new
}) {
  const [loading, setLoading] = useState(false);
  const { theme } = useThemeContext();
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // populate form if editing
  useEffect(() => {
    if (client) {
      setFormValues({
        name: client.name || "",
        email: client.email || "",
        phone: client.phone || "",
      });
    } else {
      setFormValues({ name: "", email: "", phone: "" });
    }
  }, [client, open]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const method = client ? "PUT" : "POST"; // PUT for edit
    const url = client ? `/api/clients/${client._id}` : "/api/clients/create";

    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formValues),
    });

    if (!res.ok) {
      setLoading(false);
      alert(client ? "Failed to update client" : "Failed to create client");
      return;
    }

    const updatedClient = await res.json();

    setClients((prev: any[]) => {
      if (client) {
        // replace existing client
        return prev.map((c) => (c._id === client._id ? updatedClient : c));
      }
      return [updatedClient, ...prev];
    });

    setLoading(false);
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className={`rounded-xl p-6 w-full max-w-md space-y-4
          ${theme === "dark" ? "bg-[#1F2937] text-white" : "bg-[#F3F4F6] text-gray-900"}
        `}
      >
        <h2 className="text-lg font-semibold">
          {client ? "Edit Client" : "Create Client"}
        </h2>

        <input
          name="name"
          value={formValues.name}
          onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
          required
          placeholder="Client name"
          className={`w-full rounded-lg px-3 py-2 outline-none border
            ${
              theme === "dark"
                ? "bg-[#374151] border-gray-600 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900"
            }
          `}
        />

        <input
          name="email"
          type="email"
          value={formValues.email}
          onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
          required
          placeholder="Email address"
          className={`w-full rounded-lg px-3 py-2 outline-none border
            ${
              theme === "dark"
                ? "bg-[#374151] border-gray-600 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900"
            }
          `}
        />

        <input
          name="phone"
          value={formValues.phone}
          onChange={(e) => setFormValues({ ...formValues, phone: e.target.value })}
          placeholder="Phone (optional)"
          className={`w-full rounded-lg px-3 py-2 outline-none border
            ${
              theme === "dark"
                ? "bg-[#374151] border-gray-600 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900"
            }
          `}
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className={`px-4 py-2 rounded-lg border transition transform hover:scale-105 cursor-pointer
              ${
                theme === "dark"
                  ? "border-gray-600 bg-[#374151] hover:bg-[#4B5563]"
                  : "border-gray-300 bg-white hover:bg-gray-100"
              }
            `}
          >
            Cancel
          </button>
          <button
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-[#EC4899] hover:bg-[#DB2777] text-white transition transform hover:scale-105 cursor-pointer "
          >
            {loading ? (client ? "Updating..." : "Creating...") : client ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
