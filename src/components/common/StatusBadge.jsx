function StatusBadge({ status }) {
  const styles = {
    DRAFT:
      "bg-slate-100 text-slate-700",

    PENDING_APPROVAL:
      "bg-yellow-100 text-yellow-700",

    PUBLISHED:
      "bg-green-100 text-green-700",

    REJECTED:
      "bg-red-100 text-red-700",

    NEW:
      "bg-blue-100 text-blue-700",

    CONTACTED:
      "bg-indigo-100 text-indigo-700",

    VISIT_SCHEDULED:
      "bg-purple-100 text-purple-700",

    NEGOTIATION:
      "bg-orange-100 text-orange-700",

    CLOSED:
      "bg-green-100 text-green-700",

    CANCELLED:
      "bg-red-100 text-red-700",

    COMPLETED:
      "bg-green-100 text-green-700",

    PAID:
      "bg-green-100 text-green-700",

    PENDING:
      "bg-yellow-100 text-yellow-700",
  };

  const className =
    styles[status] ||
    "bg-slate-100 text-slate-700";

  const label = status
    ? status.replaceAll("_", " ")
    : "UNKNOWN";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${className}`}
    >
      {label}
    </span>
  );
}

export default StatusBadge;