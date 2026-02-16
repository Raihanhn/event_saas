//modules/common/Pagination.tsx
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

  return (
    <div className="flex items-center justify-between mt-4 px-4 text-sm mb-4 ">
      {/* Left info */}
      <span className="text-gray-500">
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
                : "hover:bg-gray-100"
            }
            border-gray-300 text-gray-700`}
        >
          ←
        </button>

        <span className="px-3 text-gray-700">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className={`px-3 py-1 rounded-lg border transition
            ${
              page === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
            }
            border-gray-300 text-gray-700`}
        >
          →
        </button>
      </div>
    </div>
  );
}
