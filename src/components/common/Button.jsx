function Button({
  children,
  type = "button",
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
        inline-flex
        min-h-11
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-slate-900
        px-4
        py-2.5
        text-sm
        font-semibold
        text-white
        shadow-sm
        transition-all
        duration-200

        hover:-translate-y-[1px]
        hover:bg-slate-800
        hover:shadow-md

        active:translate-y-0
        active:shadow-sm

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-slate-400
        focus-visible:ring-offset-2

        disabled:cursor-not-allowed
        disabled:translate-y-0
        disabled:opacity-50
        disabled:shadow-none

        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default Button;