import { useEffect, useState } from "react";
import { Bell, Check, CheckCheck, RefreshCw, ArrowRight } from "lucide-react";
import { getMyNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "../../api/notificationApi";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [markAllLoading, setMarkAllLoading] = useState(false);
  const [error, setError] = useState("");

  const loadNotifications = async (showFullLoader = true) => {
    try {
      if (showFullLoader) setLoading(true);
      else setRefreshing(true);
      setError("");
      const data = await getMyNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load notifications.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadNotifications(); }, []);

  const handleRefresh = async () => loadNotifications(false);

  const handleMarkAsRead = async (id) => {
    try {
      setActionLoading(id);
      await markNotificationAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to mark notification as read.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setMarkAllLoading(true);
      await markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to mark all as read.");
    } finally {
      setMarkAllLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const formatType = (type) => type ? type.replace("_", " ") : "NOTIFICATION";
  const formatDate = (d) => d ? new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "";

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
          <p className="mt-3 text-sm text-slate-500">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Bell size={24} className="text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
            <p className="text-sm text-slate-500">Stay updated about your activities.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} /> Refresh
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={markAllLoading}
              className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              <CheckCheck size={15} /> {markAllLoading ? "Updating..." : "Mark all read"}
            </button>
          )}
        </div>
      </div>

      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      {notifications.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-slate-200 bg-white p-8 text-center">
          <Bell size={40} className="text-slate-300" />
          <h3 className="mt-4 text-xl font-bold text-slate-800">No notifications</h3>
          <p className="text-sm text-slate-500">New activity will appear here.</p>
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="font-bold text-slate-400">Activity</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold">{notifications.length} total</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">{unreadCount} unread</span>
            )}
          </div>
          <div className="space-y-3">
            {notifications.map((n) => {
              const unread = !n.isRead;
              return (
                <div
                  key={n.id}
                  className={`rounded-lg border p-4 transition ${unread ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-white"}`}
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${unread ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}>
                        <Bell size={16} />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase ${unread ? "text-blue-600" : "text-slate-400"}`}>
                            {formatType(n.type)}
                          </span>
                          {unread && (
                            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[8px] font-bold uppercase text-white">New</span>
                          )}
                        </div>
                        <p className={`mt-1 text-sm ${unread ? "font-semibold text-slate-900" : "font-medium text-slate-700"}`}>
                          {n.message || "You have a new notification."}
                        </p>
                        {n.createdAt && <p className="mt-1 text-xs text-slate-400">{formatDate(n.createdAt)}</p>}
                      </div>
                    </div>
                    {unread && (
                      <button
                        onClick={() => handleMarkAsRead(n.id)}
                        disabled={actionLoading === n.id}
                        className="shrink-0 rounded-lg border border-blue-200 bg-white px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                      >
                        {actionLoading === n.id ? "Updating..." : <><Check size={14} className="inline" /> Mark read</>}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {unreadCount === 0 && notifications.length > 0 && (
            <div className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-semibold text-green-700">
              <CheckCheck size={16} /> You're all caught up.
            </div>
          )}
        </>
      )}
    </div>
  );
}