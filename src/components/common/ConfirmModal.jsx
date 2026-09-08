import { AlertTriangle, X } from "lucide-react";
import Button from "./Button";

function ConfirmModal({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-elevated">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50">
              <AlertTriangle size={20} className="text-red-600" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">{title}</h2>
              <p className="mt-1 text-sm text-slate-500">{message}</p>
            </div>
          </div>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="shrink-0 text-slate-400 hover:text-slate-700 disabled:opacity-50"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
          <Button variant="outline" onClick={onCancel} disabled={loading} className="flex-1">
            {cancelText}
          </Button>

          <Button variant="danger" onClick={onConfirm} disabled={loading} className="flex-1">
            {loading ? "Processing..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;