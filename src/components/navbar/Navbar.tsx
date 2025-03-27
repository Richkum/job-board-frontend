// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../ThemeToggle";

export function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="border-b border-border dark:border-border-dark">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-1">
          <h1 className="text-2xl font-bold text-primary">Job Board</h1>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className={`${
              isActive("/")
                ? "text-primary font-medium"
                : "text-textSecondary dark:text-textSecondary-dark hover:text-text dark:hover:text-text-dark"
            } transition-colors`}
          >
            Home
          </Link>
          <Link
            href="/jobs"
            className={`${
              isActive("/jobs")
                ? "text-primary font-medium"
                : "text-textSecondary dark:text-textSecondary-dark hover:text-text dark:hover:text-text-dark"
            } transition-colors`}
          >
            Jobs
          </Link>
          <Link
            href="/settings"
            className={`${
              isActive("/settings")
                ? "text-primary font-medium"
                : "text-textSecondary dark:text-textSecondary-dark hover:text-text dark:hover:text-text-dark"
            } transition-colors`}
          >
            Settings
          </Link>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
