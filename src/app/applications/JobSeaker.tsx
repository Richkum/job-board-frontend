import LoadingIndicator from "@/components/ui/Loading";
import Toast from "@/components/ui/toast.alert";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/laoyout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";

export default function JobSeakerApplicationPage() {
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
