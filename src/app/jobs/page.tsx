// src/app/jobs/page.tsx
"use client";

import { Navbar } from "@/components/navbar/Navbar";

export default function JobsPage() {
  // Sample job listings
  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "TechCorp",
      location: "Remote",
      type: "Full-time",
    },
    {
      id: 2,
      title: "Backend Engineer",
      company: "DataSystems",
      location: "New York",
      type: "Full-time",
    },
    {
      id: 3,
      title: "UI/UX Designer",
      company: "CreativeAgency",
      location: "San Francisco",
      type: "Contract",
    },
  ];

  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark text-text dark:text-text-dark">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Available Jobs</h1>

        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-bgCard dark:bg-bgCard-dark rounded-lg shadow p-6 border border-border dark:border-border-dark"
            >
              <h2 className="font-medium text-lg">{job.title}</h2>
              <p className="text-textSecondary dark:text-textSecondary-dark text-sm mt-1">
                {job.company}
              </p>
              <div className="flex gap-2 mt-3">
                <span className="bg-bgSecondary dark:bg-bgSecondary-dark text-textSecondary dark:text-textSecondary-dark text-xs px-2 py-1 rounded">
                  {job.location}
                </span>
                <span className="bg-primary-light dark:bg-primary-dark/20 text-primary text-xs px-2 py-1 rounded">
                  {job.type}
                </span>
              </div>
              <div className="mt-4">
                <button className="bg-primary hover:bg-primary-dark text-white py-1.5 px-3 rounded text-sm transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
