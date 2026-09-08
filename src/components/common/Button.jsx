const VARIANTS = {
  primary: "bg-slate-900 text-white hover:bg-slate-800",
  accent: "bg-brand-600 text-white hover:bg-brand-700",
  outline: "border border-slate-300 text-slate-700 hover:bg-slate-50",
  ghost: "text-slate-600 hover:bg-slate-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

function Button({
  children,
  type = "button",
  variant = "primary",
  onClick,
  disabled = false,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex min-h-11 items-center justify-center gap-2
        rounded-lg px-4 py-2.5 text-sm font-medium
        transition-colors duration-150
        disabled:cursor-not-allowed disabled:opacity-50
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-brand-500 focus-visible:ring-offset-2
        ${VARIANTS[variant] || VARIANTS.primary}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default Button;