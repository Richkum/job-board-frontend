// src/context/ThemeContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type ThemeContextType = {
  theme: Theme;
  isSystemPreference: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [isSystemPreference, setIsSystemPreference] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Client-side initialization
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const initialTheme = storedTheme || (systemDark ? "dark" : "light");
    setTheme(initialTheme);
    setIsSystemPreference(!storedTheme);
    setIsReady(true);

    // Apply immediately to prevent flash
    document.documentElement.classList.add(initialTheme);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme, isReady]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      setIsSystemPreference(false);
      return newTheme;
    });
  };

  // Prevent rendering until theme is initialized
  if (!isReady) return null;

  return (
    <ThemeContext.Provider value={{ theme, isSystemPreference, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
