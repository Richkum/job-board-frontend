import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define routes that require authentication
const protectedRoutes = [
  "/dashboard",
  // Add other protected routes here
];

// Define routes that are only accessible to non-authenticated users
const authRoutes = [
  "/",
  "/login",
  "/signup",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  // Check if the path is a protected route and user is not authenticated
  if (protectedRoutes.some((route) => path.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Check if the path is an auth route and user is authenticated
  if (authRoutes.includes(path) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Configure matcher for middleware
export const config = {
  matcher: [
    // Match all protected routes
    ...protectedRoutes.map((route) => `${route}/:path*`),
    // Match all auth routes
    ...authRoutes,
  ],
};
