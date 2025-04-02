// "use client";
// import { useAuth } from "@/context/AuthContext";
// import React from "react";

// function page() {
//   const { user, logout } = useAuth();

//   return (
//     <div>
//       <h1>Dashboard</h1>
//       <p>Welcome, {user?.username}!</p>

//       <button
//         className="px-4 py-2 bg-red-500 text-white"
//         onClick={() => logout()}
//       >
//         Logout
//       </button>

//       {/* Rest of your dashboard */}
//     </div>
//   );
// }

// export default page;

"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import LoadingIndicator from "@/components/ui/Loading";

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  // Handle loading state
  if (loading) {
    return <LoadingIndicator />;
  }

  // Handle the logout process
  const handleLogout = async () => {
    await logout();
    // The logout function in AuthContext will handle the redirect
  };

  return (
    <div className="min-h-screen p-6 bg-bg dark:bg-bg-dark text-text dark:text-text-dark">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="bg-bgCard dark:bg-bgCard-dark p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Welcome, {user?.username || "User"}!
          </h2>
          <p className="text-textSecondary dark:text-textSecondary-dark">
            You are now logged in to your account.
          </p>
        </div>

        {/* User information card */}
        <div className="bg-bgCard dark:bg-bgCard-dark p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Email:</span> {user?.email}
            </p>
            <p>
              <span className="font-medium">Username:</span> {user?.username}
            </p>
            <p>
              <span className="font-medium">Role:</span> {user?.role}
            </p>
          </div>
        </div>

        {/* Additional dashboard content would go here */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-bgCard dark:bg-bgCard-dark p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <p className="text-textSecondary dark:text-textSecondary-dark">
              No recent activity to display.
            </p>
          </div>
          <div className="bg-bgCard dark:bg-bgCard-dark p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full p-2 bg-primary text-white rounded hover:bg-primary-dark dark:bg-primary-dark dark:hover:bg-primary transition-colors">
                View Profile
              </button>
              <button className="w-full p-2 bg-bgSecondary dark:bg-bgSecondary-dark text-text dark:text-text-dark rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
