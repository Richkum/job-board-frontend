"use client";
import JobSeakerApplicationPage from "./JobSeaker";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/laoyout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import LoadingIndicator from "@/components/ui/Loading";

import Toast, { ToastType } from "@/components/ui/toast.alert";
import { useState } from "react";

export default function Applications() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [toast, setToast] = useState<{
    show: boolean;
    type: ToastType;
    message: string;
  }>({
    show: false,
    type: "info",
    message: "",
  });

  const showToast = (type: ToastType, message: string) => {
    setToast({ show: true, type, message });
  };

  if (isLoading) {
    return <LoadingIndicator />;
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
          <JobSeakerApplicationPage />
        </DashboardLayout>
      </ProtectedRoute>
    </>
  );
}
