"use client";

import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Briefcase } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b border-border dark:border-border-dark sticky top-0 z-50 bg-bg dark:bg-bg-dark backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-primary text-white p-1.5 rounded">
              <Briefcase size={20} />
            </div>
            <span className="text-xl font-bold text-text dark:text-text-dark">
              JobConnect
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#Featured-Jobs"
              className="text-textSecondary dark:text-textSecondary-dark hover:text-primary dark:hover:text-primary transition-colors"
            >
              Find Jobs
            </Link>
            <Link
              href="#Featured-Jobs"
              className="text-textSecondary dark:text-textSecondary-dark hover:text-primary dark:hover:text-primary transition-colors"
            >
              For Employers
            </Link>
            <Link
              href="#how-it-works"
              className="text-textSecondary dark:text-textSecondary-dark hover:text-primary dark:hover:text-primary transition-colors"
            >
              How It Works
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="hidden md:flex space-x-3">
              <Link
                href="/login"
                className="px-4 py-2 rounded border border-border dark:border-border-dark text-textSecondary dark:text-textSecondary-dark hover:bg-bgSecondary dark:hover:bg-bgSecondary-dark transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded bg-primary hover:bg-primary-dark text-white transition-colors"
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden text-text dark:text-text-dark">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Call to Action Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-8 md:p-12 text-white">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Transform Your Career or Hiring Process?
                </h2>
                <p className="text-white/80 mb-8">
                  Join thousands of professionals and companies who trust
                  JobConnect. Start your journey today!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/signup"
                    className="px-6 py-3 rounded bg-white text-primary hover:bg-white/90 transition-colors font-medium"
                  >
                    Find a Job
                  </Link>
                  <Link
                    href="/signup"
                    className="px-6 py-3 rounded border border-white text-white hover:bg-white/10 transition-colors font-medium"
                  >
                    Post a Job
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
