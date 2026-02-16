//modules/teams/ui/TeamSearch.tsx

import { useThemeContext } from "@/context/ThemeContext";

type Props = {
  search: string;
  setSearch: (val: string) => void;
  setPage: (page: number) => void;
};

export default function TeamSearch({ search, setSearch, setPage }: Props) {
  const { theme } = useThemeContext();
  return (
    <div className="mb-4">
      <input
        placeholder="Search member..."
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setPage(1);
        }}
         className={`w-full max-w-md px-4 py-2 rounded-lg focus:outline-none border
          ${
            theme === "dark"
              ? "bg-[#111827] border-gray-700 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          }
        `}
      />
    </div>
  );
}
