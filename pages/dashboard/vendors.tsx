//pages/dashboard/vendors.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import CreateVendorModal from "@/modules/vendors/ui/CreateVendorModal";
import VendorRow from "@/modules/vendors/ui/VendorRow";
import Pagination from "@/modules/common/Pagination";
import { useThemeContext } from "@/context/ThemeContext";

const PER_PAGE = 5;

export default function Vendors({ selectedEvent, budgetsForSelectedEvent }: any) {
  const [vendors, setVendors] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */
  useEffect(() => {
    setLoading(true);

    fetch("/api/vendors")
      .then((res) => res.json())
      .then((data) => {
        setVendors(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    return vendors.filter((v) =>
      [v.name, v.email, v.phone, v.role]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [vendors, search]);

  /* ================= DELETE ================= */
  const deleteVendor = async (id: string) => {
    await fetch(`/api/vendors/${id}`, {
      method: "DELETE",
    });

    setVendors((prev) => prev.filter((v) => v._id !== id));
  };

  /* ================= PAGINATION ================= */
  const paginated = filtered.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE
  );

  const { theme } = useThemeContext();

  return (
    <div className={`p-6 h-screen space-y-6
        ${theme === "dark" ? "bg-[#111827] text-white" : "text-gray-900"}
      `}>
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold ">Vendors</h1>

        <div className="flex gap-3">
          <input
            placeholder="Search by name, email or phone"
            className={`rounded-lg px-4 py-2 w-72 outline-none border
              ${
                theme === "dark"
                  ? "bg-[#1F2937] border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900"
              }
            `}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <button
            onClick={() => setShowModal(true)}
            className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-lg cursor-pointer transition transform hover:scale-105"
          >
            + Add vendor
          </button>
        </div>
      </div>

      {/* ================= TABLE CARD ================= */}
      <div
          className={`
          rounded-2xl
          overflow-hidden
          border
          shadow-[0_10px_30px_rgba(0,0,0,0.08)]
          ${
            theme === "dark"
              ? "bg-[#1F2937] border-gray-700"
              : "bg-[#F3F4F6] backdrop-blur-md border-gray-200/60"
          }
        `}
      >
        {/* 🔄 LOADING STATE */}
        {loading ? (
          <div className="flex items-center justify-center h-60">
            <div className="flex flex-col items-center gap-3">
              <div className={`w-8 h-8 border-2 rounded-full animate-spin
                  ${
                    theme === "dark"
                      ? "border-gray-600 border-t-[#8B5CF6]"
                      : "border-gray-300 border-t-[#8B5CF6]"
                  }
                `} />
              <span className="text-sm">Loading vendors...</span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          /* 📭 EMPTY STATE */
          <div className="flex flex-col items-center justify-center h-60 p-10 text-center text-gray-500 space-y-2">
            <p className="text-lg font-medium">No vendors found</p>
            <p className="text-sm">
              Click "Add vendor" to create your first vendor
            </p>
          </div>
        ) : (
          /* 📋 DATA STATE */
          <>
            <table className="w-full text-sm">
              <thead className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}>
                <tr>
                  <th className="px-6 py-4 text-left font-medium">Vendor</th>
                  <th className="px-6 py-4 text-left font-medium">Email</th>
                  <th className="px-6 py-4 text-left font-medium">Phone</th>
                  <th className="px-6 py-4 text-left font-medium">Role</th>
                  <th className="px-6 py-4 text-left font-medium">Billing</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>

              <tbody>
                {paginated.map((v) => (
                  <VendorRow
                    key={v._id}
                    vendor={v}
                    onDelete={deleteVendor}
                      selectedEvent={selectedEvent}
                    budgets={budgetsForSelectedEvent}
                  />
                ))}
              </tbody>
            </table>

            <Pagination
              page={page}
              total={filtered.length}
              perPage={PER_PAGE}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {showModal && (
        <CreateVendorModal onClose={() => setShowModal(false)}  setVendors={setVendors}  />
      )}
       <div className="h-56"></div>
    </div>
  );
}
