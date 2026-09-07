import { Search, X } from "lucide-react";

function PropertySearch({
  value,
  onChange,
  onSearch,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();

    if (onSearch) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    if (onChange) {
      onChange("");
    }

    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full"
    >
      <div
        className="
          flex
          w-full
          flex-col
          gap-2
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-2
          shadow-sm
          transition-all
          duration-200
          focus-within:border-slate-300
          focus-within:shadow-md
          sm:flex-row
          sm:items-center
        "
      >
        {/* ==========================================
            SEARCH INPUT
        ========================================== */}

        <div
          className="
            flex
            min-w-0
            flex-1
            items-center
            gap-3
            rounded-xl
            px-3
            sm:px-4
          "
        >
          <Search
            size={20}
            strokeWidth={2}
            className="shrink-0 text-slate-400"
          />

          <input
            type="text"
            value={value ?? ""}
            onChange={(event) =>
              onChange?.(
                event.target.value
              )
            }
            placeholder="Search by property name, city or area..."
            className="
              min-w-0
              w-full
              bg-transparent
              py-3
              text-sm
              font-medium
              text-slate-900
              outline-none
              placeholder:text-slate-400
              sm:py-3.5
            "
            aria-label="Search properties"
          />

          {/* CLEAR */}

          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                text-slate-400
                transition
                hover:bg-slate-100
                hover:text-slate-700
                active:scale-95
              "
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* ==========================================
            SEARCH BUTTON
        ========================================== */}

        <button
          type="submit"
          className="
            inline-flex
            min-h-11
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-slate-900
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition-all
            duration-200

            hover:bg-slate-800
            hover:shadow-md

            active:scale-[0.98]

            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-slate-400
            focus-visible:ring-offset-2

            sm:w-auto
            sm:px-6
          "
        >
          <Search
            size={17}
            className="sm:hidden"
          />

          <span>Search</span>
        </button>
      </div>
    </form>
  );
}

export default PropertySearch;