"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingIndicator from "@/components/ui/Loading";
import LogoutButton from "@/components/ui/logout";
import DashboardLayout from "@/components/laoyout/DashboardLayout";

function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Optional - extra protection layer
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <>
        <LoadingIndicator />
      </>
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
