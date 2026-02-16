//modules/teams/ui/TeamSearch.tsx

type Props = {
  search: string;
  setSearch: (val: string) => void;
  setPage: (page: number) => void;
};

export default function TeamSearch({ search, setSearch, setPage }: Props) {
  return (
    <div className="mb-4">
      <input
        placeholder="Search member..."
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="w-full max-w-md px-4 py-2 border border-gray-300 focus:outline-none rounded-lg bg-white"
      />
    </div>
  );
}
