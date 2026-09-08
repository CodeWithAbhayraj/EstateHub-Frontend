import { Loader2 } from "lucide-react";

function Loader({
  text = "Loading...",
  size = 26,
  fullScreen = false,
  className = "",
}) {
  return (
    <div
      className={
        fullScreen
          ? `flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 ${className}`
          : `flex min-h-24 w-full flex-col items-center justify-center rounded-xl bg-white ${className}`
      }
      role="status"
      aria-live="polite"
    >
      <Loader2
        size={fullScreen ? 32 : size}
        strokeWidth={2.2}
        className="animate-spin text-slate-400"
      />

      {text && <p className="mt-3 text-sm text-slate-500">{text}</p>}
    </div>
  );
}

export default Loader;