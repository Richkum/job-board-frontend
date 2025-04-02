// src/context/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user data from localStorage on initial load
  useEffect(() => {
    console.log("Auth provider initialized, checking localStorage");
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        console.log("Found token and user in localStorage");
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        // Clear invalid data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } else {
      console.log("No token or user found in localStorage");
    }

    setLoading(false);
  }, []);

  const login = (newToken: string, userData: User) => {
    console.log("Login called with token and user data", {
      token: newToken,
      user: userData,
    });

    // Store in state
    setToken(newToken);
    setUser(userData);

    // Store in localStorage for persistence
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));

    // Navigate to dashboard after successful login
    console.log("Redirecting to dashboard");
    router.push("/dashboard");
  };

  const logout = () => {
    console.log("Logout called");

    // Optional: Call logout API
    if (token) {
      fetch("http://localhost:5000/api/auth/logout-all", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).catch((error) => {
        console.error("Logout API call failed:", error);
      });
    }

    // Clear state and localStorage
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to homepage
    router.push("/");
  };

  // Calculate isAuthenticated based on token presence
  const isAuthenticated = !!token;

  console.log("Auth state:", { user, token, isAuthenticated, loading });

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
