// modules/budgets/ui/VendorOverview.tsx

"use client";

import { useThemeContext } from "@/context/ThemeContext";

interface VendorRow {
  vendorId: string;
  name: string;
  avatar?: string;
  task: string;
  totalCost: number;
  paid: number;
  budgetId: string;
  subcategoryName: string;
}

const VendorOverview = ({
  vendors,
  onUpdatePaid,
}: {
  vendors: VendorRow[];
  onUpdatePaid: (row: VendorRow, paid: number) => void;
}) => {

  const { theme } = useThemeContext();

  if (!vendors.length) {
    return (
      <div  className={`rounded-2xl shadow p-8 text-center ${
          theme === "dark"
            ? "bg-gray-800 text-gray-400"
            : "bg-white text-gray-500"
        }`}>
        No vendors assigned yet
      </div>
    );
  }

  return (
    <div className={`rounded-2xl shadow p-6 overflow-x-auto ${
        theme === "dark" ? "bg-gray-800" : "bg-[#F3F4F6]"
      }`}>
      <h2 className={`text-xl font-semibold mb-4 ${
          theme === "dark" ? "text-gray-200" : "text-gray-700"
        }`}>
        Vendor Overview
      </h2>

      <table className="min-w-full table-auto border-collapse text-sm">
        <thead className={`border-b ${
            theme === "dark"
              ? "bg-gray-700 border-gray-600"
              : "bg-gray-50 border-gray-200"
          }`}>
         <tr>
            {["Vendor", "Task", "Total", "Paid", "Due", "Status"].map(
              (head) => (
                <th
                  key={head}
                  className={`px-4 py-3 font-medium ${
                    head === "Vendor" || head === "Task"
                      ? "text-left w-1/4"
                      : "text-center w-1/6"
                  } ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }
                  ${
                    head === "Vendor" ? "rounded-tl-md" : ""
                  }
                  ${
                    head === "Status" ? "rounded-tr-md" : ""
                  }
                  `}
                >
                  {head}
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody  className={`divide-y ${
            theme === "dark" ? "divide-gray-700" : "divide-gray-100"
          }`}>
          {vendors.map((v, i) => {
            const due = v.totalCost - v.paid;

            return (
              <tr
                key={i}
                className={`transition-colors duration-150 ${
                  theme === "dark"
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-50"
                }`}
              >
                <td className="px-4 py-3 flex items-center gap-3">
                  {v.avatar ? (
                    <img
                      src={v.avatar}
                      alt={v.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold text-sm">
                      {v.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                  )}
                  <span  className={`font-medium ${
                      theme === "dark" ? "text-gray-200" : "text-gray-700"
                    }`}>{v.name}</span>
                </td>

                <td className={`px-4 py-3 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}>{v.task}</td>

                <td className={`px-4 py-3 text-center font-medium ${
                    theme === "dark" ? "text-gray-200" : "text-gray-700"
                  }`}>
                  ${v.totalCost.toLocaleString()}
                </td>

                <td className={`px-4 py-3 text-center font-medium ${
                    theme === "dark" ? "text-gray-200" : "text-gray-700"
                  }`}>
                  ${v.paid.toLocaleString()}
                </td>

                <td
                  className={`px-4 py-3 text-center font-medium ${
                    due === 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  ${due.toLocaleString()}
                </td>

                <td
                  className={`px-4 py-3 text-center font-medium ${
                    due === 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {due === 0 ? "Paid" : "Pending"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default VendorOverview;
