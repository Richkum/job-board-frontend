// src/app/settings/page.tsx
"use client";

import AuthTest from "@/components/AuthDebug";
import DashboardLayout from "@/components/laoyout/DashboardLayout";
import { Navbar } from "@/components/navbar/Navbar";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <DashboardLayout>
        <div className="p-4 lg:p-8">
          {/* <AuthTest /> */}
          <h1 className="text-2xl font-bold mb-4">Settings</h1>

          <div className="mb-6">
            <p className="mb-2">CYour are now on the settings page</p>
            <Link href="/settings/profile">
              {" "}
              <p>Profile settings</p>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
}
