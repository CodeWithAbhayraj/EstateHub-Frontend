import { useEffect, useState } from "react";

import {
  Bell,
  Check,
  CheckCheck,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../api/notificationApi";

function Notifications() {
  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(null);

  const [markAllLoading, setMarkAllLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==========================================
  // LOAD NOTIFICATIONS
  // ==========================================

  const loadNotifications = async (
    showFullLoader = true
  ) => {
    try {
      if (showFullLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const data =
        await getMyNotifications();

      setNotifications(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Notifications error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load notifications."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadNotifications();
  }, []);

  // ==========================================
  // REFRESH
  // ==========================================

  const handleRefresh = async () => {
    await loadNotifications(false);
  };

  // ==========================================
  // MARK ONE AS READ
  // ==========================================

  const handleMarkAsRead = async (
    id
  ) => {
    try {
      setActionLoading(id);
      setError("");

      await markNotificationAsRead(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );
    } catch (err) {
      console.error(
        "Mark notification error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to mark notification as read."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // MARK ALL AS READ
  // ==========================================

  const handleMarkAllAsRead =
    async () => {
      try {
        setMarkAllLoading(true);
        setError("");

        await markAllNotificationsAsRead();

        setNotifications((prev) =>
          prev.map(
            (notification) => ({
              ...notification,
              isRead: true,
            })
          )
        );
      } catch (err) {
        console.error(
          "Mark all notifications error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to mark notifications as read."
        );
      } finally {
        setMarkAllLoading(false);
      }
    };

  // ==========================================
  // UNREAD COUNT
  // ==========================================

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.isRead
    ).length;

  // ==========================================
  // FORMAT TYPE
  // ==========================================

  const formatType = (type) => {
    if (!type) {
      return "NOTIFICATION";
    }

    return String(type).replaceAll(
      "_",
      " "
    );
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    try {
      return new Date(
        date
      ).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-[60vh] w-full">
        <div className="flex min-h-[60vh] items-center justify-center">

          <div className="text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">

              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

            </div>

            <p className="mt-4 text-sm font-semibold text-slate-700">
              Loading notifications...
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Please wait a moment.
            </p>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="w-full">

      {/* ==========================================
          HEADER
      ========================================== */}

      <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="relative p-5 sm:p-7 lg:p-8">

          {/* Background decoration */}

          <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-blue-50 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            {/* TITLE */}

            <div className="flex min-w-0 items-start gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Bell size={21} />
              </div>

              <div className="min-w-0">

                <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-600">
                  Buyer
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Notifications
                </h1>

                <p className="mt-1 text-sm leading-6 text-slate-500 sm:text-base">
                  Stay updated about your activities.
                </p>

              </div>

            </div>


            {/* ACTIONS */}

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">

              {/* REFRESH */}

              <button
                type="button"
                onClick={handleRefresh}
                disabled={
                  refreshing
                }
                className="
                  inline-flex
                  min-h-11
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-slate-700
                  shadow-sm
                  transition

                  hover:bg-slate-50

                  active:scale-[0.98]

                  disabled:cursor-not-allowed
                  disabled:opacity-50

                  sm:w-auto
                "
              >
                <RefreshCw
                  size={16}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh
              </button>


              {/* MARK ALL */}

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={
                    handleMarkAllAsRead
                  }
                  disabled={
                    markAllLoading
                  }
                  className="
                    inline-flex
                    min-h-11
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-slate-900
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition

                    hover:bg-slate-800

                    active:scale-[0.98]

                    disabled:cursor-not-allowed
                    disabled:opacity-50

                    sm:w-auto
                  "
                >
                  <CheckCheck
                    size={17}
                  />

                  {markAllLoading
                    ? "Updating..."
                    : "Mark All as Read"}
                </button>
              )}

            </div>

          </div>

        </div>

      </section>


      {/* ==========================================
          ERROR
      ========================================== */}

      {error && (
        <div
          className="
            mb-6
            rounded-2xl
            border
            border-red-200
            bg-red-50
            p-4
            text-sm
            font-medium
            leading-5
            text-red-600
          "
          role="alert"
        >
          {error}
        </div>
      )}


      {/* ==========================================
          SUMMARY
      ========================================== */}

      {notifications.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-2">

          <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
            Activity
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {notifications.length} total
          </span>

          {unreadCount > 0 && (
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
              {unreadCount} unread
            </span>
          )}

        </div>
      )}


      {/* ==========================================
          EMPTY STATE
      ========================================== */}

      {notifications.length === 0 ? (

        <div className="flex min-h-[380px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

          <div className="max-w-md">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">

              <Bell
                size={30}
                className="text-blue-400"
              />

            </div>

            <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-900">
              No notifications
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              You don't have any notifications yet. New activity will appear here.
            </p>

          </div>

        </div>

      ) : (

        /* ==========================================
           NOTIFICATION LIST
        ========================================== */

        <div className="space-y-3">

          {notifications.map(
            (notification) => {

              const unread =
                !notification.isRead;

              const actionLoadingForItem =
                actionLoading ===
                notification.id;

              return (
                <article
                  key={notification.id}
                  className={`
                    rounded-2xl
                    border
                    p-4
                    shadow-sm
                    transition-all
                    duration-200
                    sm:p-5

                    ${
                      unread
                        ? "border-blue-200 bg-blue-50/60"
                        : "border-slate-200 bg-white"
                    }
                  `}
                >

                  <div className="flex items-start gap-3 sm:gap-4">

                    {/* ICON */}

                    <div
                      className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl

                        ${
                          unread
                            ? "bg-blue-100 text-blue-600"
                            : "bg-slate-100 text-slate-500"
                        }
                      `}
                    >
                      <Bell size={18} />
                    </div>


                    {/* CONTENT */}

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">

                        <div className="min-w-0">

                          {/* TYPE */}

                          <div className="flex flex-wrap items-center gap-2">

                            <span
                              className={`
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.12em]

                                ${
                                  unread
                                    ? "text-blue-600"
                                    : "text-slate-400"
                                }
                              `}
                            >
                              {formatType(
                                notification.type
                              )}
                            </span>

                            {unread && (
                              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                                New
                              </span>
                            )}

                          </div>


                          {/* MESSAGE */}

                          <p
                            className={`
                              mt-2
                              text-sm
                              leading-6
                              ${
                                unread
                                  ? "font-semibold text-slate-900"
                                  : "font-medium text-slate-700"
                              }
                            `}
                          >
                            {notification.message ||
                              "You have a new notification."}
                          </p>

                        </div>


                        {/* MARK READ */}

                        {unread && (
                          <button
                            type="button"
                            onClick={() =>
                              handleMarkAsRead(
                                notification.id
                              )
                            }
                            disabled={
                              actionLoadingForItem
                            }
                            className="
                              inline-flex
                              min-h-10
                              w-full
                              shrink-0
                              items-center
                              justify-center
                              gap-2
                              rounded-xl
                              border
                              border-blue-200
                              bg-white
                              px-3
                              py-2
                              text-xs
                              font-semibold
                              text-blue-600
                              transition

                              hover:bg-blue-50

                              active:scale-[0.98]

                              disabled:cursor-not-allowed
                              disabled:opacity-50

                              sm:w-auto
                            "
                          >

                            {actionLoadingForItem ? (
                              <>
                                <RefreshCw
                                  size={14}
                                  className="animate-spin"
                                />

                                Updating...
                              </>
                            ) : (
                              <>
                                <Check
                                  size={15}
                                />

                                Mark Read
                              </>
                            )}

                          </button>
                        )}

                      </div>


                      {/* DATE */}

                      {notification.createdAt && (
                        <p className="mt-3 text-xs font-medium text-slate-400">
                          {formatDate(
                            notification.createdAt
                          )}
                        </p>
                      )}

                    </div>

                  </div>

                </article>
              );
            }
          )}

        </div>

      )}


      {/* ==========================================
          BOTTOM INFO
      ========================================== */}

      {notifications.length > 0 &&
        unreadCount === 0 && (
          <div className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-xs font-semibold text-green-700">

            <CheckCheck size={16} />

            You're all caught up.

            <ArrowRight
              size={14}
              className="opacity-60"
            />

          </div>
        )}

    </div>
  );
}

export default Notifications;