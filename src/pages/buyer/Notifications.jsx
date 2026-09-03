import { useEffect, useState } from "react";
import { Bell, Check, CheckCheck } from "lucide-react";

import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../api/notificationApi";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyNotifications();

      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Notifications error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (err) {
      console.error("Mark notification error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to mark notification as read."
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (err) {
      console.error("Mark all notifications error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to mark notifications as read."
      );
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b bg-white">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Bell size={26} />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Notifications
                </h1>

                <p className="mt-1 text-slate-500">
                  Stay updated about your activities.
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-50"
              >
                <CheckCheck size={18} />
                Mark All as Read
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {notifications.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <Bell size={48} className="mx-auto text-slate-300" />

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              No notifications
            </h2>

            <p className="mt-2 text-slate-500">
              You don't have any notifications yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-2xl border p-5 shadow-sm ${
                  notification.isRead
                    ? "border-slate-200 bg-white"
                    : "border-blue-200 bg-blue-50"
                }`}
              >
                <div className="flex gap-4">
                  <div
                    className={`mt-1 rounded-full p-2 ${
                      notification.isRead
                        ? "bg-slate-100 text-slate-500"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    <Bell size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          {notification.type}
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-900">
                          {notification.message}
                        </p>
                      </div>

                      {!notification.isRead && (
                        <button
                          onClick={() =>
                            handleMarkAsRead(notification.id)
                          }
                          className="inline-flex h-fit items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                        >
                          <Check size={16} />
                          Mark Read
                        </button>
                      )}
                    </div>

                    {notification.createdAt && (
                      <p className="mt-3 text-xs text-slate-400">
                        {new Date(
                          notification.createdAt
                        ).toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Notifications;