"use client";
import LoadingIndicator from "@/components/ui/Loading";
import Toast from "@/components/ui/toast.alert";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/laoyout/DashboardLayout";

export default function Companies() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen 
                    bg-bg dark:bg-bg-dark"
      >
        <h2 className="text-2xl font-bold text-text dark:text-text-dark mb-4">
          Please login to view jobs
        </h2>
        <p className="text-textSecondary dark:text-textSecondary-dark">
          You need to be logged in to access this page
        </p>
      </div>
    );
  }

  return (
    <>
      <ProtectedRoute>
        <DashboardLayout>
          {" "}
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Companies</h1>
            {/* Add your content here */}
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    </>
  );
}
