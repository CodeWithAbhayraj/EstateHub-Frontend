import { Inbox } from "lucide-react";

function EmptyState({
  title = "No data found",
  message = "There is nothing to display.",
  icon: Icon = Inbox,
  action,
}) {
  return (
    <div className="surface p-8 text-center sm:p-10">
      <Icon size={36} className="mx-auto mb-4 text-slate-300" />

      <h3 className="text-base font-semibold text-slate-900">{title}</h3>

      <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-500">{message}</p>

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export default EmptyState;