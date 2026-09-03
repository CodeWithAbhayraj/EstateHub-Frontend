import { Search } from "lucide-react";

function PropertySearch({ value, onChange, onSearch }) {
  const handleSubmit = (event) => {
    event.preventDefault();

    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-1 items-center gap-3 px-4">
          <Search size={20} className="text-slate-400" />

          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Search by property name, city or area..."
            className="w-full py-4 text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 px-6 font-semibold text-white transition hover:bg-blue-700"
        >
          Search
        </button>
      </div>
    </form>
  );
}

export default PropertySearch;