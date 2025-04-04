"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  FiBriefcase,
  FiMapPin,
  FiDollarSign,
  FiClock,
  FiUser,
} from "react-icons/fi";
import { Job, JobSalary } from "@/types/jobs";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const formatSalary = (salary?: JobSalary) => {
    if (!salary?.range) return "Salary not specified";
    const { range, currency, period, isNegotiable } = salary;

    if (!range.min && !range.max)
      return isNegotiable ? "Salary negotiable" : "Salary not specified";

    const formatNumber = (num: number) =>
      new Intl.NumberFormat("en-US").format(num);

    let salaryRange = "";
    if (range.min && range.max) {
      salaryRange = `${formatNumber(range.min)} - ${formatNumber(range.max)}`;
    } else if (range.min) {
      salaryRange = `From ${formatNumber(range.min)}`;
    } else if (range.max) {
      salaryRange = `Up to ${formatNumber(range.max)}`;
    }

    return `${currency} ${salaryRange} per ${period}${
      isNegotiable ? " (Negotiable)" : ""
    }`;
  };

  return (
    <div
      onClick={() => router.push(`/jobs/${job._id}`)}
      className="group cursor-pointer bg-white dark:bg-bgCard-dark rounded-lg
                 border border-border dark:border-border-dark
                 hover:shadow-lg hover:border-primary dark:hover:border-primary
                 transition-all duration-200"
    >
      <div className="p-6">
        {/* Company Logo and Job Title */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {!imageError ? (
              <img
                src={job.company?.logo || "/company-placeholder.png"}
                alt={`${job.company?.name || "Company"} logo`}
                className="w-12 h-12 rounded-lg object-cover bg-bgSecondary dark:bg-bgSecondary-dark"
                onError={() => setImageError(true)}
              />
            ) : (
              <div
                className="w-12 h-12 rounded-lg bg-bgSecondary dark:bg-bgSecondary-dark
                            flex items-center justify-center"
              >
                <FiBriefcase className="w-6 h-6 text-textMuted dark:text-textMuted-dark" />
              </div>
            )}
          </div>

          <div className="flex-grow min-w-0">
            <h3
              className="text-lg font-semibold text-text dark:text-text-dark
                          group-hover:text-primary truncate"
            >
              {job.title}
            </h3>
            <p className="text-sm text-textSecondary dark:text-textSecondary-dark mb-1">
              {job.company?.name || "Company Name"}
            </p>
            <p className="text-sm text-textMuted dark:text-textMuted-dark line-clamp-2">
              {job.subtitle}
            </p>
          </div>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex items-center text-sm text-textSecondary dark:text-textSecondary-dark">
            <FiBriefcase className="w-4 h-4 mr-2 text-textMuted dark:text-textMuted-dark" />
            <span className="truncate">{job.jobType}</span>
          </div>

          <div className="flex items-center text-sm text-textSecondary dark:text-textSecondary-dark">
            <FiMapPin className="w-4 h-4 mr-2 text-textMuted dark:text-textMuted-dark" />
            <span className="truncate">
              {job.location.type}
              {job.location.city && ` • ${job.location.city}`}
            </span>
          </div>

          <div className="flex items-center text-sm text-textSecondary dark:text-textSecondary-dark">
            <FiUser className="w-4 h-4 mr-2 text-textMuted dark:text-textMuted-dark" />
            <span className="truncate">{job.experienceLevel}</span>
          </div>

          <div className="flex items-center text-sm text-textSecondary dark:text-textSecondary-dark">
            <FiClock className="w-4 h-4 mr-2 text-textMuted dark:text-textMuted-dark" />
            <span className="truncate">
              {format(new Date(job.applicationDeadline), "MMM dd, yyyy")}
            </span>
          </div>
        </div>

        {/* Salary */}
        <div className="mt-4 flex items-center text-sm">
          <FiDollarSign className="w-4 h-4 mr-2 text-success" />
          <span className="text-success font-medium">
            {formatSalary(job.salary)}
          </span>
        </div>

        {/* Tags */}
        {job.technicalRequirements && job.technicalRequirements.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {job.technicalRequirements.slice(0, 3).map((req, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full
                         bg-accent/10 text-accent dark:text-accent-light
                         border border-accent/20"
              >
                {req}
              </span>
            ))}
            {job.technicalRequirements.length > 3 && (
              <span
                className="px-2 py-1 text-xs rounded-full
                             bg-bgSecondary dark:bg-bgSecondary-dark
                             text-textSecondary dark:text-textSecondary-dark"
              >
                +{job.technicalRequirements.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
