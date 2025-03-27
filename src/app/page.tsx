// src/app/page.tsx
"use client";

import { Navbar } from "@/components/navbar/Navbar";
import LandingPage from "@/job-board/page";

export default function Home() {
  return (
    <>
      {/* <div className="min-h-screen bg-bg dark:bg-bg-dark text-text dark:text-text-dark">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Welcome to your Professional Job Board
          </h2>
          <p className="text-textSecondary dark:text-textSecondary-dark mb-4">
            This is the home page. Navigate to other pages to see that the theme
            persists across the application.
          </p> */}

      {/* Sample card */}
      {/* <div className="bg-bgCard dark:bg-bgCard-dark rounded-lg shadow p-6 mb-6 border border-border dark:border-border-dark">
            <h3 className="font-medium mb-2">Featured Job</h3>
            <p className="text-textSecondary dark:text-textSecondary-dark text-sm mb-4">
              Senior Developer at TechCorp
            </p>
            <div className="flex gap-2 mb-4">
              <span className="bg-primary-light dark:bg-primary-dark/20 text-primary text-xs px-2 py-1 rounded">
                Full-time
              </span>
              <span className="bg-accent-light dark:bg-accent-dark/20 text-accent text-xs px-2 py-1 rounded">
                Remote
              </span>
            </div>
            <button className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded transition-colors">
              Apply Now
            </button>
          </div>
        </section>
      </main>
    </div> */}
      <LandingPage />
    </>
  );
}
