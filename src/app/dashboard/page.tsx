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
    // <ProtectedRoute>
    //   <DashboardLayout>
    //     <div className="p-4 md:p-6 lg:p-8 bg-bg dark:bg-bg-dark min-h-screen">
    //       {/* Header */}
    //       <div className="mb-8">
    //         <h1 className="text-3xl md:text-4xl font-bold text-text dark:text-text-dark mb-2">
    //           Welcome back, {user?.username || "Job Seeker"}! 👋
    //         </h1>
    //         <p className="text-textSecondary dark:text-textSecondary-dark">
    //           Here's what's happening with your job search today
    //         </p>
    //       </div>

    //       {/* Stats Grid */}
    //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
    //         {/* Jobs Viewed Card */}
    //         <div className="bg-bgCard dark:bg-bgCard-dark rounded-lg shadow-sm border border-border dark:border-border-dark p-6 hover:shadow-md transition-shadow duration-200">
    //           <div className="flex items-center justify-between mb-4">
    //             <div className="w-12 h-12 bg-primary-light dark:bg-primary-dark rounded-lg flex items-center justify-center">
    //               <span className="text-2xl">👁️</span>
    //             </div>
    //             <span className="text-xs font-medium text-primary dark:text-primary px-3 py-1 bg-primary-light dark:bg-primary-dark/20 rounded-full">
    //               +12 this week
    //             </span>
    //           </div>
    //           <h3 className="text-textSecondary dark:text-textSecondary-dark text-sm font-medium mb-1">
    //             Jobs Viewed
    //           </h3>
    //           <p className="text-3xl font-bold text-text dark:text-text-dark">
    //             {dashboardStats.jobsViewed}
    //           </p>
    //         </div>

    //         {/* Applications Card */}
    //         <div className="bg-bgCard dark:bg-bgCard-dark rounded-lg shadow-sm border border-border dark:border-border-dark p-6 hover:shadow-md transition-shadow duration-200">
    //           <div className="flex items-center justify-between mb-4">
    //             <div className="w-12 h-12 bg-secondary-light dark:bg-secondary-dark rounded-lg flex items-center justify-center">
    //               <span className="text-2xl">📝</span>
    //             </div>
    //             <span className="text-xs font-medium text-secondary dark:text-secondary px-3 py-1 bg-secondary-light dark:bg-secondary-dark/20 rounded-full">
    //               Active
    //             </span>
    //           </div>
    //           <h3 className="text-textSecondary dark:text-textSecondary-dark text-sm font-medium mb-1">
    //             Applications Sent
    //           </h3>
    //           <p className="text-3xl font-bold text-text dark:text-text-dark">
    //             {dashboardStats.applications}
    //           </p>
    //         </div>

    //         {/* Saved Jobs Card */}
    //         <div className="bg-bgCard dark:bg-bgCard-dark rounded-lg shadow-sm border border-border dark:border-border-dark p-6 hover:shadow-md transition-shadow duration-200">
    //           <div className="flex items-center justify-between mb-4">
    //             <div className="w-12 h-12 bg-accent-light dark:bg-accent-dark rounded-lg flex items-center justify-center">
    //               <span className="text-2xl">💾</span>
    //             </div>
    //             <span className="text-xs font-medium text-accent dark:text-accent px-3 py-1 bg-accent-light dark:bg-accent-dark/20 rounded-full">
    //               Saved
    //             </span>
    //           </div>
    //           <h3 className="text-textSecondary dark:text-textSecondary-dark text-sm font-medium mb-1">
    //             Saved Jobs
    //           </h3>
    //           <p className="text-3xl font-bold text-text dark:text-text-dark">
    //             {dashboardStats.savedJobs}
    //           </p>
    //         </div>

    //         {/* Profile Views Card */}
    //         <div className="bg-bgCard dark:bg-bgCard-dark rounded-lg shadow-sm border border-border dark:border-border-dark p-6 hover:shadow-md transition-shadow duration-200">
    //           <div className="flex items-center justify-between mb-4">
    //             <div className="w-12 h-12 bg-success/10 dark:bg-success/20 rounded-lg flex items-center justify-center">
    //               <span className="text-2xl">👤</span>
    //             </div>
    //             <span className="text-xs font-medium text-success px-3 py-1 bg-success/10 dark:bg-success/20 rounded-full">
    //               +5 today
    //             </span>
    //           </div>
    //           <h3 className="text-textSecondary dark:text-textSecondary-dark text-sm font-medium mb-1">
    //             Profile Views
    //           </h3>
    //           <p className="text-3xl font-bold text-text dark:text-text-dark">
    //             {dashboardStats.profileViews}
    //           </p>
    //         </div>

    //         {/* Interviews Scheduled Card */}
    //         <div className="bg-bgCard dark:bg-bgCard-dark rounded-lg shadow-sm border border-border dark:border-border-dark p-6 hover:shadow-md transition-shadow duration-200">
    //           <div className="flex items-center justify-between mb-4">
    //             <div className="w-12 h-12 bg-warning/10 dark:bg-warning/20 rounded-lg flex items-center justify-center">
    //               <span className="text-2xl">📅</span>
    //             </div>
    //             <span className="text-xs font-medium text-warning px-3 py-1 bg-warning/10 dark:bg-warning/20 rounded-full">
    //               Upcoming
    //             </span>
    //           </div>
    //           <h3 className="text-textSecondary dark:text-textSecondary-dark text-sm font-medium mb-1">
    //             Interviews Scheduled
    //           </h3>
    //           <p className="text-3xl font-bold text-text dark:text-text-dark">
    //             {dashboardStats.interviewsScheduled}
    //           </p>
    //         </div>

    //         {/* Pending Applications Card */}
    //         <div className="bg-bgCard dark:bg-bgCard-dark rounded-lg shadow-sm border border-border dark:border-border-dark p-6 hover:shadow-md transition-shadow duration-200">
    //           <div className="flex items-center justify-between mb-4">
    //             <div className="w-12 h-12 bg-info/10 dark:bg-info/20 rounded-lg flex items-center justify-center">
    //               <span className="text-2xl">⏳</span>
    //             </div>
    //             <span className="text-xs font-medium text-info px-3 py-1 bg-info/10 dark:bg-info/20 rounded-full">
    //               Pending
    //             </span>
    //           </div>
    //           <h3 className="text-textSecondary dark:text-textSecondary-dark text-sm font-medium mb-1">
    //             Pending Reviews
    //           </h3>
    //           <p className="text-3xl font-bold text-text dark:text-text-dark">
    //             {dashboardStats.pendingApplications}
    //           </p>
    //         </div>
    //       </div>

    //       {/* Recent Activity Section */}
    //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
    //         {/* Recent Activity */}
    //         <div className="lg:col-span-2 bg-bgCard dark:bg-bgCard-dark rounded-lg shadow-sm border border-border dark:border-border-dark p-6">
    //           <h2 className="text-xl font-bold text-text dark:text-text-dark mb-4">
    //             Recent Activity 📊
    //           </h2>
    //           <div className="space-y-4">
    //             {recentActivity.map((activity, index) => (
    //               <div
    //                 key={index}
    //                 className="flex items-start gap-4 pb-4 border-b border-border dark:border-border-dark last:border-b-0 last:pb-0"
    //               >
    //                 <div
    //                   className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
    //                     activity.type === "application"
    //                       ? "bg-success/10"
    //                       : activity.type === "view"
    //                       ? "bg-primary-light dark:bg-primary-dark/20"
    //                       : "bg-accent-light dark:bg-accent-dark/20"
    //                   }`}
    //                 >
    //                   <span className="text-lg">
    //                     {activity.type === "application"
    //                       ? "✅"
    //                       : activity.type === "view"
    //                       ? "👀"
    //                       : "⭐"}
    //                   </span>
    //                 </div>
    //                 <div className="flex-1 min-w-0">
    //                   <p className="text-text dark:text-text-dark font-medium">
    //                     {activity.action}
    //                   </p>
    //                   <p className="text-sm text-textMuted dark:text-textMuted-dark">
    //                     {activity.time}
    //                   </p>
    //                 </div>
    //               </div>
    //             ))}
    //           </div>
    //         </div>

    //         {/* Quick Actions */}
    //         <div className="bg-bgCard dark:bg-bgCard-dark rounded-lg shadow-sm border border-border dark:border-border-dark p-6">
    //           <h2 className="text-xl font-bold text-text dark:text-text-dark mb-4">
    //             Quick Actions ⚡
    //           </h2>
    //           <div className="space-y-3">
    //             <button className="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors duration-200">
    //               Browse Jobs
    //             </button>
    //             <button className="w-full py-3 px-4 bg-secondary hover:bg-secondary-dark text-white rounded-lg font-medium transition-colors duration-200">
    //               View Applications
    //             </button>
    //             <button className="w-full py-3 px-4 bg-accent hover:bg-accent-dark text-white rounded-lg font-medium transition-colors duration-200">
    //               Update Profile
    //             </button>
    //             <button className="w-full py-3 px-4 border-2 border-border dark:border-border-dark hover:bg-bgSecondary dark:hover:bg-bgSecondary-dark text-text dark:text-text-dark rounded-lg font-medium transition-colors duration-200">
    //               Saved Jobs
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </DashboardLayout>
    // </ProtectedRoute>
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
