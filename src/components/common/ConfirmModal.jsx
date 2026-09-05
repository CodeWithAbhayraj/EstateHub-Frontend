import { AlertTriangle, X } from "lucide-react";

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
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

        {/* HEADER */}

        <div className="flex items-start justify-between gap-4">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
              <AlertTriangle
                size={20}
                className="text-red-600"
              />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {title}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {message}
              </p>
            </div>

          </div>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="text-slate-400 hover:text-slate-700"
            >
              <X size={18} />
            </button>
          )}

        </div>

        {/* ACTIONS */}

        <div className="mt-6 flex gap-3">

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : confirmText}
          </button>

        </div>

      </div>
    </div>
  );
}

export default ConfirmModal;