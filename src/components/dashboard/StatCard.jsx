function StatCard({
  title,
  value,
  icon: Icon,
  description,
  className = "",
}) {
  return (
    <div
      className={`
        group
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-4
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-slate-300
        hover:shadow-md
        sm:p-5
        ${className}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        {/* ==========================================
            TEXT
        ========================================== */}

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold uppercase tracking-wide text-slate-400 sm:text-sm">
            {title}
          </p>

          <p className="mt-2 truncate text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {value ?? 0}
          </p>

          {description && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-400 sm:text-sm">
              {description}
            </p>
          )}
        </div>

        {/* ==========================================
            ICON
        ========================================== */}

        {Icon && (
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-slate-100
              text-slate-600
              transition-all
              duration-200
              group-hover:bg-slate-900
              group-hover:text-white
              sm:h-11
              sm:w-11
            "
          >
            <Icon
              size={20}
              strokeWidth={2}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;