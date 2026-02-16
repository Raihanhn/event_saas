// modules/vendors/ui/VendorRow.tsx
import { useState } from "react";
import VendorActions from "./VendorActions";
import Image from "next/image";
import VendorBillingModal from "./VendorBillingModal";
import { createPortal } from "react-dom";
import { useThemeContext } from "@/context/ThemeContext";

export default function VendorRow({ vendor, onDelete }: any) {
  const [billingModalOpen, setBillingModalOpen] = useState(false);
   const { theme } = useThemeContext();

  return (
    <>
      <tr className={`transition
          ${
            theme === "dark"
              ? "hover:bg-gray-800 text-gray-200"
              : "hover:bg-gray-50 text-gray-900"
          }
        `}>
        <td className="px-6 py-4 flex items-center gap-3">
          <Image
            src={vendor.avatar || "/clients/avatar1.jpg"}
            alt={vendor.name || "Vendor"}
            width={36}
            height={36}
            className="rounded-full object-cover"
          />
          <p className="font-medium capitalize">{vendor.name}</p>
        </td>
        <td className="px-6 py-4">{vendor.email}</td>
        <td className={`px-6 py-4 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}>{vendor.phone || "—"}</td>
        <td className={`px-6 py-4 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}>{vendor.role || "N/A"}</td>
        <td className="px-6 py-4">
          <button
            onClick={() => setBillingModalOpen(true)}
            className={`px-4 py-1.5 rounded-full text-xs transition border
              ${
                theme === "dark"
                  ? "border-indigo-400 text-indigo-400 hover:bg-indigo-400/10"
                  : "border-indigo-600 text-indigo-600 hover:bg-indigo-50"
              }
            `}
          >
            Billing
          </button>
        </td>
        <td className="px-6 py-4 text-right">
          <VendorActions vendor={vendor} onEdit={() => {}} onDelete={onDelete} />
        </td>
      </tr>

      {billingModalOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <VendorBillingModal
            vendor={vendor}
            onClose={() => setBillingModalOpen(false)}
          />,
          document.body
        )}
    </>
  );
}
