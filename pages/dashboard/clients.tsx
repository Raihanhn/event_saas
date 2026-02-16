//pages,dashboard/clients.tsx
import React, { useState } from "react";
import jwt from "jsonwebtoken";
import { GetServerSideProps } from "next";
import toast from "react-hot-toast";
import Client from "@/modules/clients/client.model";
import { connectDB } from "@/lib/mongodb";
import ClientCard from "@/modules/clients/ui/ClientCard";
import CreateClientModal from "@/modules/clients/ui/CreateClientModal";
import ShareEventModal from "@/modules/clients/ui/ShareEventModal";

interface Props {
  initialClients: any[];
}

export default function Clients({ initialClients }: Props) {
  const [clients, setClients] = useState(initialClients);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any | null>(null);
  const [shareClient, setShareClient] = useState<any | null>(null);

  async function handleSearch(value: string) {
    setSearch(value);

    const res = await fetch(`/api/clients?q=${value}`, {
      credentials: "include",
    });
    const data = await res.json();
    setClients(data);
  }

  // <-- Add it here inside the component
  async function handleDelete(id: string) {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="font-medium">Delete this client?</p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 rounded border border-gray-300  transition transform hover:scale-105 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);

                const res = await fetch(`/api/clients/${id}`, {
                  method: "DELETE",
                  credentials: "include",
                });

                if (!res.ok) {
                  toast.error("Failed to delete client");
                  return;
                }

                setClients((prev) => prev.filter((c) => c._id !== id));
                toast.success("Client deleted");
              }}
              className="px-3 py-1 rounded bg-red-500 text-white  transition transform hover:scale-105 cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: 6000 },
    );
  }

  // Example: handleEdit (can be alert for now)
  function handleEdit(client: any) {
    setEditingClient(client);
    setOpen(true);
  }

  return (
    <div className="p-6 space-y-6 h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Clients</h1>

        <div className="flex gap-3 w-full md:w-auto">
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search name, email, phone"
            className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-72 outline-none"
          />

          <button
            onClick={() => setOpen(true)}
            className=" bg-[#EC4899] hover:bg-[#DB2777] text-white px-4 py-2 rounded-lg whitespace-nowrap cursor-pointer transition transform hover:scale-105 "
          >
            Create Client
          </button>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {clients.length === 0 && (
          <>
            {["Demo Client 1", "Demo Client 2", "Demo Client 3"].map((d) => (
              <div
                key={d}
                className="h-40 rounded-xl border border-dashed flex items-center justify-center text-gray-400"
              >
                {d}
              </div>
            ))}
          </>
        )}

        {clients.map((client) => (
          <ClientCard
            key={client._id}
            client={client}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onShare={(client) => setShareClient(client)}
          />
        ))}
      </div>

      <CreateClientModal
        open={open}
        setOpen={(v) => {
          setOpen(v);
          if (!v) setEditingClient(null); // clear after closing
        }}
        setClients={setClients}
        client={editingClient}
      />

      {shareClient && (
        <ShareEventModal
          client={shareClient}
          onClose={() => setShareClient(null)}
        />
      )}
       <div className="h-56"></div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

  await connectDB();

  const clients = await Client.find({
    organization: decoded.orgId,
  })
    .sort({ createdAt: -1 })
    .lean();

  return {
    props: {
      initialClients: JSON.parse(JSON.stringify(clients)),
      token,
    },
  };
};
