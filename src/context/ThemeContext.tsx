"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type ThemeContextType = {
  theme: Theme;
  isSystemPreference: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "theme-preference";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Try to get the stored theme immediately
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === "light" || stored === "dark") {
        return stored;
      }
    }
    return "light"; // Default fallback
  });

  const [isSystemPreference, setIsSystemPreference] = useState(() => {
    if (typeof window !== "undefined") {
      return !localStorage.getItem(THEME_STORAGE_KEY);
    }
    return true;
  });

  const [isReady, setIsReady] = useState(false);

  // One-time initialization effect
  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;

    if (!storedTheme) {
      // Only check system preference if no stored theme
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const initialTheme = systemDark ? "dark" : "light";
      setTheme(initialTheme);
      setIsSystemPreference(true);
    } else {
      setTheme(storedTheme);
      setIsSystemPreference(false);
    }

    setIsReady(true);
  }, []); // Run only once on mount

  // Effect to handle theme changes
  useEffect(() => {
    if (!isReady) return;

    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    // Only store theme when it's not system preference
    if (!isSystemPreference) {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } else {
      localStorage.removeItem(THEME_STORAGE_KEY);
    }
  }, [theme, isReady, isSystemPreference]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      setIsSystemPreference(false);
      return newTheme;
    });
  };

  // During SSR or before hydration, return a placeholder
  if (typeof window === "undefined" || !isReady) {
    return <>{children}</>;
  }

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
