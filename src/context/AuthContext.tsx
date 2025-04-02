"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define types
interface User {
  id: string;
  username: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (username: string, email: string, password: string) => Promise<any>;
  logout: (sessionId?: string) => Promise<any>;
  logoutAll: () => Promise<any>;
  verifyEmail: (email: string, code: string) => Promise<any>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (
    email: string,
    code: string,
    newPassword: string
  ) => Promise<any>;
  getSessions: () => Promise<any>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: true,
  login: async () => ({}),
  register: async () => ({}),
  logout: async () => ({}),
  logoutAll: async () => ({}),
  verifyEmail: async () => ({}),
  forgotPassword: async () => ({}),
  resetPassword: async () => ({}),
  getSessions: async () => [],
});

// API base URL - consider moving this to an environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if we're in the browser environment
  const isBrowser = typeof window !== "undefined";

  // Create fetch wrapper with authentication
  const authFetch = async (url: string, options: RequestInit = {}) => {
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    const response = await fetch(`${API_URL}${url}`, options);

    // Handle 401 responses (unauthorized) by logging out
    if (response.status === 401 && !url.includes("/auth/")) {
      await logout();
      throw new Error("Session expired. Please log in again.");
    }

    return response;
  };

  // Load user from localStorage on initial render
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        if (isBrowser) {
          const storedToken = localStorage.getItem("token");
          const storedUser = localStorage.getItem("user");

          if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));

            // Validate token with backend
            try {
              const response = await fetch(`${API_URL}/auth/sessions`, {
                headers: {
                  Authorization: `Bearer ${storedToken}`,
                },
              });

              if (!response.ok) {
                // Token is invalid, clear auth state
                setToken(null);
                setUser(null);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
              }
            } catch (error) {
              // Error validating token, clear auth state
              setToken(null);
              setUser(null);
              localStorage.removeItem("token");
              localStorage.removeItem("user");
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw data;
      }

      const { token: newToken, user: userData } = data;

      // Store in state
      setToken(newToken);
      setUser(userData);

      // Store in both cookie and localStorage for persistence
      if (isBrowser) {
        // Set in localStorage for easy access in JS
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(userData));

        // Set in cookie for middleware (needs js-cookie package)
        // This requires the js-cookie package to be installed
        // npm install js-cookie
        // npm install --save-dev @types/js-cookie
        try {
          const Cookies = await import("js-cookie").then((mod) => mod.default);
          Cookies.set("token", newToken, {
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            expires: 7, // 7 days
          });
        } catch (err) {
          console.warn("js-cookie not available, skipping cookie storage");
        }
      }

      // Redirect to dashboard
      router.push("/dashboard");

      return data;
    } catch (error: any) {
      throw error || { message: "Login failed" };
    }
  };

  // Register function
  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw data;
      }

      return data;
    } catch (error: any) {
      throw error || { message: "Registration failed" };
    }
  };

  // Verify email
  const verifyEmail = async (email: string, code: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw data;
      }

      // If verification succeeds with auto-login
      if (data.token && data.user) {
        setToken(data.token);
        setUser(data.user);

        if (isBrowser) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        // Redirect to dashboard
        router.push("/dashboard");
      }

      return data;
    } catch (error: any) {
      throw error || { message: "Email verification failed" };
    }
  };

  // Logout function
  const logout = async (sessionId?: string) => {
    try {
      if (token) {
        const url = sessionId
          ? `/auth/logout/${sessionId}`
          : "/auth/logout/current";

        await authFetch(url, { method: "POST" });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear auth state regardless of API response
      setUser(null);
      setToken(null);

      if (isBrowser) {
        // Clear localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Clear cookie
        try {
          const Cookies = await import("js-cookie").then((mod) => mod.default);
          Cookies.remove("token", { path: "/" });
        } catch (err) {
          console.warn("js-cookie not available, skipping cookie removal");
        }
      }

      // Redirect to home page
      router.push("/");
    }
  };

  // Logout all sessions
  const logoutAll = async () => {
    try {
      if (token) {
        await authFetch("/auth/logout-all", { method: "POST" });
      }
    } catch (error) {
      console.error("Logout all error:", error);
    } finally {
      // Clear auth state regardless of API response
      setUser(null);
      setToken(null);

      if (isBrowser) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      // Redirect to home page
      router.push("/");
    }
  };

  // Forgot password
  const forgotPassword = async (email: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw data;
      }

      return data;
    } catch (error: any) {
      throw error || { message: "Password reset request failed" };
    }
  };

  // Reset password
  const resetPassword = async (
    email: string,
    code: string,
    newPassword: string
  ) => {
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw data;
      }

      return data;
    } catch (error: any) {
      throw error || { message: "Password reset failed" };
    }
  };

  // Get user sessions
  const getSessions = async () => {
    try {
      const response = await authFetch("/auth/sessions");

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      return await response.json();
    } catch (error: any) {
      throw error || { message: "Failed to fetch sessions" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        logoutAll,
        verifyEmail,
        forgotPassword,
        resetPassword,
        getSessions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
