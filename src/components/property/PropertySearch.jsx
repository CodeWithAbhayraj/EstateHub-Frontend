import { Search, X } from "lucide-react";

function PropertySearch({ value, onChange, onSearch }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch?.(value);
  };

  const handleClear = () => {
    onChange?.("");
    onSearch?.("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex w-full flex-col gap-2 rounded-xl border border-slate-200 bg-white p-2 transition-colors focus-within:border-slate-300 sm:flex-row sm:items-center">
        {/* SEARCH INPUT */}
        <div className="flex min-w-0 flex-1 items-center gap-3 px-3 sm:px-4">
          <Search size={19} className="shrink-0 text-slate-400" />

          <input
            type="text"
            value={value ?? ""}
            onChange={(event) => onChange?.(event.target.value)}
            placeholder="Search by property name, city or area..."
            className="min-w-0 w-full bg-transparent py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 sm:py-3"
            aria-label="Search properties"
          />

          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* SEARCH BUTTON */}
        <button
          type="submit"
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 sm:w-auto sm:px-6"
        >
          <Search size={16} className="sm:hidden" />
          <span>Search</span>
        </button>
      </div>
    </form>
  );
}

export default PropertySearch;