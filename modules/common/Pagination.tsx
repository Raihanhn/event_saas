//modules/common/Pagination.tsx

import { useThemeContext } from "@/context/ThemeContext";

interface Props {
  page: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  total,
  perPage,
  onPageChange,
}: Props) {
  const totalPages = Math.ceil(total / perPage);

  if (total <= perPage) return null;
  const { theme } = useThemeContext();

  return (
    <div className="flex items-center justify-between mt-4 px-4 text-sm mb-4 ">
      {/* Left info */}
      <span className={`${
          theme === "dark" ? "text-gray-400" : "text-gray-500"
        }`}>
        {(page - 1) * perPage + 1}–
        {Math.min(page * perPage, total)} of {total}
      </span>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
           className={`px-3 py-1 rounded-lg border transition
            ${
              page === 1
                ? "opacity-50 cursor-not-allowed"
                : theme === "dark"
                ? "hover:bg-gray-700"
                : "hover:bg-gray-100"
            }
            ${
              theme === "dark"
                ? "border-gray-600 text-gray-300"
                : "border-gray-300 text-gray-700"
            }
          `}
        >
          ←
        </button>

        <span className={`px-3 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
           className={`px-3 py-1 rounded-lg border transition
            ${
              page === totalPages
                ? "opacity-50 cursor-not-allowed"
                : theme === "dark"
                ? "hover:bg-gray-700"
                : "hover:bg-gray-100"
            }
            ${
              theme === "dark"
                ? "border-gray-600 text-gray-300"
                : "border-gray-300 text-gray-700"
            }
          `}
        >
          →
        </button>
      </div>
    </div>
  );
}
