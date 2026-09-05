import { AlertCircle, X } from "lucide-react";

function ErrorMessage({
  message = "Something went wrong.",
  onClose,
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
      <div className="flex items-start gap-3">
        <AlertCircle
          size={19}
          className="mt-0.5 shrink-0"
        />

        <p className="text-sm font-medium">
          {message}
        </p>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 text-red-500 hover:text-red-700"
        >
          <X size={17} />
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;