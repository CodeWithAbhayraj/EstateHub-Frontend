import { Loader2 } from "lucide-react";

function LoadingSpinner({
  text = "Loading...",
  fullScreen = false,
}) {
  return (
    <div
      className={
        fullScreen
          ? "flex min-h-screen items-center justify-center bg-slate-50"
          : "flex min-h-40 items-center justify-center"
      }
    >
      <div className="text-center">
        <Loader2
          size={36}
          className="mx-auto animate-spin text-slate-700"
        />

        <p className="mt-3 text-sm text-slate-500">
          {text}
        </p>
      </div>
    </div>
  );
}

export default LoadingSpinner;