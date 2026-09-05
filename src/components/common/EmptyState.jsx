import { Inbox } from "lucide-react";

function EmptyState({
  title = "No data found",
  message = "There is nothing to display.",
  icon: Icon = Inbox,
  action,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <Icon
        size={42}
        className="mx-auto mb-4 text-slate-300"
      />

      <h3 className="text-lg font-bold text-slate-900">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        {message}
      </p>

      {action && (
        <div className="mt-5">
          {action}
        </div>
      )}
    </div>
  );
}

export default EmptyState;