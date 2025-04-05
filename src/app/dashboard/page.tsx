"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingIndicator from "@/components/ui/Loading";
import LogoutButton from "@/components/ui/logout";
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

        // Simulate an error (uncomment to test)
        // throw new Error("Something went wrong fetching dashboard details");

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
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

          <div className="mb-6">
            <p className="mb-2">Welcome, {user?.username || user?.email}!</p>
            {user?.email && (
              <p className="text-sm text-gray-600">Email: {user.email}</p>
            )}
          </div>

          <LogoutButton />

          {/* Rest of your dashboard */}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

export default Dashboard;
