"use client";

import { Job } from "@/types/jobs";
import JobCard from "./JobCard";
import Pagination from "./Pagination";
import { FiBriefcase } from "react-icons/fi";

interface JobListProps {
  jobs: Job[];
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    hasMore: boolean;
  };
  onPageChange: (page: number) => void;
}

export default function JobList({
  jobs,
  pagination,
  onPageChange,
}: JobListProps) {
  if (jobs.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[400px] 
                    bg-white dark:bg-bgCard-dark rounded-lg p-8 
                    border border-border dark:border-border-dark"
      >
        <div
          className="w-16 h-16 mb-4 rounded-full bg-bgSecondary dark:bg-bgSecondary-dark
                      flex items-center justify-center"
        >
          <FiBriefcase className="w-8 h-8 text-textMuted dark:text-textMuted-dark" />
        </div>
        <h3 className="text-xl font-semibold text-text dark:text-text-dark mb-2">
          No jobs found
        </h3>
        <p className="text-textSecondary dark:text-textSecondary-dark text-center max-w-md">
          We couldn't find any jobs matching your criteria. Try adjusting your
          filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="grid gap-y-4">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>

      <div
        className="flex items-center justify-between text-sm text-textSecondary 
                    dark:text-textSecondary-dark py-4"
      >
        <span>
          Showing {(pagination.currentPage - 1) * 10 + 1} to{" "}
          {Math.min(pagination.currentPage * 10, pagination.total)} of{" "}
          {pagination.total} jobs
        </span>
      </div>

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
          className="py-4"
        />
      )}
    </div>
  );
}
