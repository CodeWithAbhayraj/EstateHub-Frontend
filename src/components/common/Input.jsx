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
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`
          min-h-11 w-full rounded-lg border bg-white px-3.5 py-2.5
          text-sm text-slate-800 outline-none transition-colors duration-150
          placeholder:text-slate-400
          disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400
          ${error
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 hover:border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"}
          ${className}
        `}
      />

      {error && (
        <p id={`${name}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;