"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingIndicator from "@/components/ui/Loading";
import DashboardLayout from "@/components/laoyout/DashboardLayout";
import Toast from "@/components/ui/toast.alert";

function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDahboardDetails = async () => {
      try {
        // Simulate loading (replace this with your actual fetch call)
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // If successful, clear error (if any)
        setError(null);
      } catch (err: any) {
        setError(err.message || "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDahboardDetails();
  }, []);

  // Static data for now - will be replaced with dynamic data later
  const dashboardStats = {
    jobsViewed: 47,
    applications: 12,
    savedJobs: 8,
    profileViews: 23,
    interviewsScheduled: 3,
    pendingApplications: 9,
  };

  const recentActivity = [
    {
      action: "Applied to Senior Developer position",
      time: "2 hours ago",
      type: "application",
    },
    {
      action: "Viewed Frontend Engineer job",
      time: "5 hours ago",
      type: "view",
    },
    {
      action: "Saved Marketing Manager position",
      time: "1 day ago",
      type: "save",
    },
  ];

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
    <ProtectedRoute>
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center bg-bg dark:bg-bg-dark p-4">
          <div className="text-center max-w-sm">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-border dark:border-border-dark mb-6">
              <span className="text-xl">!</span>
            </div>
            <p className="text-2xl font-bold mb-3 text-text dark:text-text-dark">
              Page Unavailable
            </p>
            <p className="text-textSecondary dark:text-textSecondary-dark mb-6">
              This dashboard section is under construction. We appreciate your
              patience.
            </p>
            <div className="text-xs text-textMuted dark:text-textMuted-dark">
              Coming soon...
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

export default Dashboard;
