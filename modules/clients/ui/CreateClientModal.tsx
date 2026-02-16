// modules/clients/ui/CreateClientModal.tsx
import { useState, useEffect } from "react";

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
        className="bg-white rounded-xl p-6 w-full max-w-md space-y-4"
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
          className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
        />

        <input
          name="email"
          type="email"
          value={formValues.email}
          onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
          required
          placeholder="Email address"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
        />

        <input
          name="phone"
          value={formValues.phone}
          onChange={(e) => setFormValues({ ...formValues, phone: e.target.value })}
          placeholder="Phone (optional)"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none "
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-4 py-2 rounded-lg border border-gray-300 cursor-pointer transition transform hover:scale-105 "
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
