function StatCard({ title, value, icon: Icon, description, className = "" }) {
  return (
    <div className={`surface p-4 sm:p-5 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        {/* TEXT */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-slate-500">{title}</p>

          <p className="mt-1.5 truncate text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            {value ?? 0}
          </p>

          {description && (
            <p className="mt-1 line-clamp-2 text-xs text-slate-400 sm:text-sm">
              {description}
            </p>
          )}
        </div>

        {/* ICON */}
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 sm:h-11 sm:w-11">
            <Icon size={19} strokeWidth={2} />
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;