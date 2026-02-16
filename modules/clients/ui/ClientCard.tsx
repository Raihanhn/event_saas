// modules/clients/ui/ClientCard.tsx
import Image from "next/image";
import { Pencil, Trash2, Mail, Phone, Share2 } from "lucide-react";
import { useState } from "react";
import ShareEventModal from "./ShareEventModal";

export default function ClientCard({
  client,
  onEdit,
  onDelete,
  onShare,
}: {
  client: any;
  onEdit?: (client: any) => void;
  onDelete?: (id: string) => void;
  onShare?: (client: any) => void;
}) {

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition transform hover:scale-105 ">
      {/* Main row */}
      <div className="flex justify-between items-start gap-4">
        {/* Left column: Avatar, Name, Email & Phone */}
        <div className="flex flex-col items-start gap-2">
          {/* Avatar + Name row */}
          <div className="flex items-center gap-3">
            <Image
              src={client.avatar || "/clients/avatar1.jpg"}
              alt={client.name || "Client"}
              width={48}
              height={48}
              className="rounded-full"
            />

            <p className="font-medium capitalize text-gray-900 leading-tight">
              {client.name}
            </p>
          </div>

          {/* Email */}
          {client.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail size={14} className="text-gray-400 hover:text-[#DB2777] " />
              <span className="break-all">{client.email}</span>
            </div>
          )}

          {/* Phone */}
          {client.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone size={14} className="text-gray-400 hover:text-[#DB2777]" />
              <span>{client.phone}</span>
            </div>
          )}
        </div>

        {/* Right column: Edit/Delete icons */}
        <div className="flex flex-col items-end gap-2">

          <button onClick={() => onShare?.(client)} title="Share event">
          <Share2 size={16} className="text-gray-400 hover:text-pink-500 cursor-pointer " />
        </button>

          <button
            onClick={() => onEdit?.(client)}
            className="cursor-pointer text-gray-400 hover:text-[#DB2777]"
            title="Edit client"
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={() => onDelete?.(client._id)}
            className="cursor-pointer text-gray-400 hover:text-[#DB2777]"
            title="Delete client"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

    </div>
  );
}
