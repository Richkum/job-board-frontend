// src/app/settings/page.tsx
"use client";

import { Navbar } from "@/components/navbar/Navbar";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark text-text dark:text-text-dark">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <div className="bg-bgCard dark:bg-bgCard-dark rounded-lg shadow p-6 border border-border dark:border-border-dark">
          <h2 className="font-medium text-lg mb-4">Appearance</h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-textSecondary dark:text-textSecondary-dark text-sm">
                Choose between light and dark theme
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-textSecondary dark:text-textSecondary-dark">
                {theme === "light" ? "Light" : "Dark"}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={theme === "dark"}
                  onChange={toggleTheme}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-bgSecondary dark:bg-bgSecondary-dark rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
