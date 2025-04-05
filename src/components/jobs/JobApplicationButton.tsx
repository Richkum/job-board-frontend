"use client";

import { FiArrowRight, FiClock } from "react-icons/fi";

interface JobApplicationButtonProps {
  deadline: string;
  onApply: () => void;
  isDisabled?: boolean;
  className?: string;
}

export default function JobApplicationButton({
  deadline,
  onApply,
  isDisabled,
  className = "",
}: JobApplicationButtonProps) {
  const isDeadlinePassed = new Date(deadline) < new Date();

  return (
    <div
      className={`bg-white dark:bg-bgCard-dark rounded-lg p-6 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-semibold text-text dark:text-text-dark">
            Interested in this position?
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <FiClock className="text-textMuted dark:text-textMuted-dark" />
            <p className="text-textSecondary dark:text-textSecondary-dark">
              {isDeadlinePassed
                ? "Application period has ended"
                : "Apply now and we'll get back to you soon"}
            </p>
          </div>
        </div>
        <button
          onClick={onApply}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 
                    transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 
                    disabled:cursor-not-allowed disabled:hover:bg-primary"
          disabled={isDeadlinePassed || isDisabled}
        >
          {isDeadlinePassed ? (
            "Application Closed"
          ) : (
            <>
              Apply Now
              <FiArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
