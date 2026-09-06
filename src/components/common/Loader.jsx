import { Loader2 } from "lucide-react";

function Loader({
  text = "Loading...",
  size = 28,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center ${className}`}
    >
      <Loader2
        size={size}
        className="animate-spin text-slate-700"
      />

      {text && (
        <p className="mt-3 text-sm text-slate-500">
          {text}
        </p>
      )}
    </div>
  );
}

export default Loader;