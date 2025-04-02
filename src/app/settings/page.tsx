// src/app/settings/page.tsx
"use client";

import AuthTest from "@/components/AuthDebug";
import { Navbar } from "@/components/navbar/Navbar";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      {/* Your existing content */}
      <AuthTest />
    </div>
  );
}
