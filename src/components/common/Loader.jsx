import { Loader2 } from "lucide-react";

function Loader({ text = "Loading...", size = 26, className = "" }) {
  return (
    <div
      className={`flex min-h-24 w-full flex-col items-center justify-center rounded-xl bg-white ${className}`}
      role="status"
      aria-live="polite"
    >
      <Loader2 size={size} strokeWidth={2.2} className="animate-spin text-slate-400" />

      {text && <p className="mt-3 text-sm text-slate-500">{text}</p>}
    </div>
  );
}

export default Loader;