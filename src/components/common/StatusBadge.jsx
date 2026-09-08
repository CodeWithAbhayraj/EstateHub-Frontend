// One small color set (tone) reused for every status, instead of a
// different bright hue per status. This keeps the palette consistent
// across the whole app instead of cycling through 7+ colors on one screen.
const TONES = {
  neutral: "bg-slate-100 text-slate-600",
  info: "bg-blue-50 text-blue-700",
  warning: "bg-amber-50 text-amber-700",
  success: "bg-emerald-50 text-emerald-700",
  danger: "bg-red-50 text-red-700",
};

const STATUS_TONE = {
  DRAFT: "neutral",
  PENDING_APPROVAL: "warning",
  PENDING: "warning",
  PUBLISHED: "success",
  PAID: "success",
  COMPLETED: "success",
  CLOSED: "success",
  REJECTED: "danger",
  CANCELLED: "danger",
  NEW: "info",
  CONTACTED: "info",
  VISIT_SCHEDULED: "info",
  NEGOTIATION: "warning",
};

function StatusBadge({ status }) {
  const tone = TONES[STATUS_TONE[status]] || TONES.neutral;
  const label = status ? status.replaceAll("_", " ") : "UNKNOWN";

  return (
    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${tone}`}>
      {label}
    </span>
  );
}

export default StatusBadge;