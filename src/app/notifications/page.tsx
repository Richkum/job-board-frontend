"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/laoyout/DashboardLayout";
import LoadingIndicator from "@/components/ui/Loading";
import { useAuth } from "@/context/AuthContext";
import Toast from "@/components/ui/toast.alert";

export default function NotificationsPage() {
  const { user } = useAuth();
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
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-gray-500">No notifications available.</p>
      </div>
    </DashboardLayout>
  );
}
