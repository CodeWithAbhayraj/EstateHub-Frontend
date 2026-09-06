import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../api/notificationApi";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const token = localStorage.getItem("token");

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD NOTIFICATIONS
  // ==========================================

  const fetchNotifications = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [notificationData, countData] =
        await Promise.all([
          getMyNotifications(),
          getUnreadNotificationCount(),
        ]);

      setNotifications(
        Array.isArray(notificationData)
          ? notificationData
          : []
      );

      setUnreadCount(
        typeof countData === "number"
          ? countData
          : 0
      );
    } catch (err) {
      console.error(
        "Notification fetch error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // MARK ONE AS READ
  // ==========================================

  const markAsRead = async (notificationId) => {
    try {
      const updatedNotification =
        await markNotificationAsRead(
          notificationId
        );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? updatedNotification
            : notification
        )
      );

      setUnreadCount((prev) =>
        prev > 0 ? prev - 1 : 0
      );

      return updatedNotification;
    } catch (err) {
      console.error(
        "Mark notification read error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to mark notification as read."
      );

      throw err;
    }
  };

  // ==========================================
  // MARK ALL AS READ
  // ==========================================

  const markAllAsRead = async () => {
    try {
      setError("");

      await markAllNotificationsAsRead();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
          readAt:
            notification.readAt ||
            new Date().toISOString(),
        }))
      );

      setUnreadCount(0);
    } catch (err) {
      console.error(
        "Mark all notifications read error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to mark all notifications as read."
      );

      throw err;
    }
  };

  // ==========================================
  // REFRESH
  // ==========================================

  const refreshNotifications = async () => {
    await fetchNotifications();
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    if (token) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [token, fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,

        fetchNotifications,
        refreshNotifications,

        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

// ==========================================
// USE NOTIFICATION CONTEXT
// ==========================================

export function useNotifications() {
  const context = useContext(
    NotificationContext
  );

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    );
  }

  return context;
}

export default NotificationContext;