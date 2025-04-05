"use client";
import LoadingIndicator from "@/components/ui/Loading";
import Toast from "@/components/ui/toast.alert";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/laoyout/DashboardLayout";
import { useState, useEffect } from "react";

export default function Companies() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // Simulate loading (replace this with your actual fetch call)
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Simulate an error (uncomment to test)
        // throw new Error("Something went wrong fetching companies");

        // If successful, clear error (if any)
        setError(null);
      } catch (err: any) {
        setError(err.message || "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
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
