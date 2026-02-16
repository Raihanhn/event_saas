// modules/vendors/ui/VendorRow.tsx
import { useState } from "react";
import VendorActions from "./VendorActions";
import Image from "next/image";
import VendorBillingModal from "./VendorBillingModal";
import { createPortal } from "react-dom";

export default function VendorRow({ vendor, onDelete }: any) {
  const [billingModalOpen, setBillingModalOpen] = useState(false);

  return (
    <>
      <tr className="hover:bg-gray-50 transition">
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
        <td className="px-6 py-4">{vendor.phone || "—"}</td>
        <td className="px-6 py-4">{vendor.role || "N/A"}</td>
        <td className="px-6 py-4">
          <button
            onClick={() => setBillingModalOpen(true)}
            className="border border-indigo-600 text-indigo-600 px-4 py-1.5 rounded-full text-xs hover:bg-indigo-50 transition"
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
