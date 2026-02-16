// modules/clients/ui/ClientCard.tsx
import Image from "next/image";
import { Pencil, Trash2, Mail, Phone, Share2 } from "lucide-react";
import { useThemeContext } from "@/context/ThemeContext";

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

  const { theme } = useThemeContext();

  return (
    <div className={`rounded-xl border p-4 shadow-sm transition transform hover:scale-105
        ${
          theme === "dark"
            ? "bg-[#1F2937] border-gray-700 text-white"
            : "bg-[#F3F4F6] border-gray-200 text-gray-900"
        }
      `}>
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

            <p className={`font-medium capitalize leading-tight
                ${theme === "dark" ? "text-white" : "text-gray-900"}
              `}>
              {client.name}
            </p>
          </div>

          {/* Email */}
          {client.email && (
            <div className={`flex items-center gap-2 text-sm
                ${theme === "dark" ? "text-gray-300" : "text-gray-600"}
              `}>
              <Mail size={14} className="text-gray-400 hover:text-[#DB2777] " />
              <span className="break-all">{client.email}</span>
            </div>
          )}

          {/* Phone */}
          {client.phone && (
            <div className={`flex items-center gap-2 text-sm
                ${theme === "dark" ? "text-gray-300" : "text-gray-600"}
              `}>
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
