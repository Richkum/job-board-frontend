"use client";

import { Navbar } from "@/components/navbar/Navbar";
import LoadingIndicator from "@/components/ui/Loading";
import { useAuth } from "@/context/AuthContext";
import LandingPage from "@/job-board/page";
import { useRouter } from "next/navigation"; // Fixed: use next/navigation instead of next/router
import { useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  // If loading, show loading indicator
  if (isLoading) {
    return (
      <>
        <LoadingIndicator />
      </>
    );
  }

  // If authenticated, don't render the landing page (will redirect in useEffect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <ProtectedRoute requireAuth={false}>
        <LandingPage />
      </ProtectedRoute>
    </>
  );
}
