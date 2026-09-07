function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select",
  disabled = false,
  required = false,
  className = "",
}) {
  return (
    <div className="w-full">
      {/* ==========================================
          LABEL
      ========================================== */}

      {label && (
        <label
          htmlFor={name}
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          {label}

          {required && (
            <span
              className="ml-1 text-red-500"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      )}

      {/* ==========================================
          SELECT
      ========================================== */}

      <select
        id={name}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`
          min-h-11
          w-full
          rounded-xl
          border
          border-slate-200
          bg-white
          px-4
          py-2.5
          text-sm
          font-medium
          text-slate-800
          shadow-sm

          outline-none

          transition-all
          duration-200

          hover:border-slate-400

          focus:border-slate-500
          focus:ring-4
          focus:ring-slate-100

          disabled:cursor-not-allowed
          disabled:border-slate-200
          disabled:bg-slate-100
          disabled:text-slate-500
          disabled:shadow-none

          ${className}
        `}
      >
        {/* ========================================
            PLACEHOLDER
        ======================================== */}

        <option value="" disabled={required}>
          {placeholder}
        </option>

        {/* ========================================
            OPTIONS
        ======================================== */}

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;