"use client";
import { useEffect, useState } from "react";
import LoadingIndicator from "@/components/ui/Loading";
import Toast from "@/components/ui/toast.alert";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import DashboardLayout from "@/components/laoyout/DashboardLayout";

export default function NotificationsPage() {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Simulate loading (replace this with your actual fetch call)
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Simulate an error (uncomment to test)
        // throw new Error("Something went wrong fetching notifications");

        // If successful, clear error (if any)
        setError(null);
      } catch (err: any) {
        setError(err.message || "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    console.error("Notifications:", notifications);
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <LoadingIndicator />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Toast type="error" message={error} onClose={() => setError(null)} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-text dark:text-text-dark">
          Notifications
        </h1>
        {notifications.length === 0 ? (
          <p className="text-textMuted dark:text-textMuted-dark">
            No notifications available.
          </p>
        ) : (
          <div className="w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text dark:text-text-dark">
                Your Notifications
              </h3>
              <button
                onClick={markAllAsRead}
                className="text-sm text-primary dark:text-primary-dark hover:text-primary-dark dark:hover:text-primary transition-colors"
              >
                Mark all as read
              </button>
            </div>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => {
                    if (!notification.read) {
                      markAsRead(notification._id);
                    }
                    if (notification.actionUrl) {
                      window.location.href = notification.actionUrl;
                    }
                  }}
                  className={`p-4 border border-border dark:border-border-dark rounded-md cursor-pointer ${
                    notification.read
                      ? "bg-bgCard dark:bg-bgCard-dark"
                      : "bg-primary-light dark:bg-primary-dark"
                  } hover:bg-bgSecondary dark:hover:bg-bgSecondary-dark transition-colors`}
                >
                  <div className="flex items-start gap-x-4">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-text dark:text-text-dark">
                        {notification.title}
                      </p>
                      <p className="text-sm text-textSecondary dark:text-textSecondary-dark">
                        {notification.message}
                      </p>
                      <p className="text-xs text-textMuted dark:text-textMuted-dark mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary-dark rounded-full mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
