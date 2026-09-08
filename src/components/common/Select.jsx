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
      {label && (
        <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <select
        id={name}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`
          min-h-11 w-full rounded-lg border border-slate-200 bg-white
          px-3.5 py-2.5 text-sm text-slate-800 outline-none
          transition-colors duration-150
          hover:border-slate-300
          focus:border-brand-500 focus:ring-2 focus:ring-brand-100
          disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400
          ${className}
        `}
      >
        <option value="" disabled={required}>
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;