"use client";

import { useEffect, ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  fallback?: ReactNode;
}

/**
 * ProtectedRoute component
 *
 * - When requireAuth is true (default): Protects routes from unauthenticated users
 * - When requireAuth is false: Prevents authenticated users from accessing certain routes
 *   (like login, register, etc.)
 */
const ProtectedRoute = ({
  children,
  requireAuth = true,
  fallback,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Skip during server-side rendering
    if (typeof window === "undefined") return;

    // If still loading, wait
    if (isLoading) return;

    // For protected routes (requireAuth = true)
    if (requireAuth && !isAuthenticated) {
      router.push("/");
      return;
    }

    // For auth routes (requireAuth = false)
    if (!requireAuth && isAuthenticated) {
      router.push("/dashboard");
      return;
    }

    // Passed all checks, should render children
    setShouldRender(true);
  }, [isAuthenticated, isLoading, router, requireAuth]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  // Don't render children if authentication check fails
  if ((requireAuth && !isAuthenticated) || (!requireAuth && isAuthenticated)) {
    return fallback || null;
  }

  // If all checks pass, render children
  return <>{children}</>;
};

export default ProtectedRoute;
