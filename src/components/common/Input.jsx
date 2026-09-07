function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  error = "",
  disabled = false,
  required = false,
  className = "",
}) {
  const hasError = Boolean(error);

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
          INPUT
      ========================================== */}

      <input
        id={name}
        name={name}
        type={type}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-invalid={hasError}
        aria-describedby={
          hasError ? `${name}-error` : undefined
        }
        className={`
          min-h-11
          w-full
          rounded-xl
          border
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

          placeholder:text-slate-400

          hover:border-slate-400

          focus:ring-4

          disabled:cursor-not-allowed
          disabled:border-slate-200
          disabled:bg-slate-100
          disabled:text-slate-500

          ${
            hasError
              ? `
                border-red-300
                focus:border-red-500
                focus:ring-red-50
              `
              : `
                border-slate-200
                focus:border-slate-500
                focus:ring-slate-100
              `
          }

          ${className}
        `}
      />

      {/* ==========================================
          ERROR
      ========================================== */}

      {hasError && (
        <p
          id={`${name}-error`}
          className="mt-1.5 text-xs font-medium leading-5 text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;