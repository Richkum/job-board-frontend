import LoadingIndicator from "@/components/ui/Loading";
import Toast from "@/components/ui/toast.alert";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/laoyout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

export default function JobSeakerApplicationPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // Simulate loading (replace this with your actual fetch call)
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Simulate an error (uncomment to test)
        // throw new Error("Something went wrong fetching applications");

        // If successful, clear error (if any)
        setError(null);
      } catch (err: any) {
        setError(err.message || "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
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
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Job Seaker</h1>
        {/* Add your content here */}
        <p>Here are your applications</p>{" "}
      </div>
    </>
  );
}
