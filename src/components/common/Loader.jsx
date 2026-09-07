import { Loader2 } from "lucide-react";

function Loader({
  text = "Loading...",
  size = 28,
  className = "",
}) {
  return (
    <div
      className={`
        flex
        min-h-24
        w-full
        flex-col
        items-center
        justify-center
        rounded-2xl
        bg-white
        ${className}
      `}
      role="status"
      aria-live="polite"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50">
        <Loader2
          size={size}
          strokeWidth={2.2}
          className="animate-spin text-slate-700"
        />
      </div>

      {text && (
        <p className="mt-3 text-sm font-medium text-slate-500">
          {text}
        </p>
      )}
    </div>
  );
}

export default Loader;