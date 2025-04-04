"use client";

import { FiAlertCircle } from "react-icons/fi";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = "Something went wrong",
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[400px] 
                    bg-white dark:bg-bgCard-dark rounded-lg p-8 
                    border border-border dark:border-border-dark"
    >
      <div
        className="w-16 h-16 mb-4 rounded-full bg-danger/10 
                    flex items-center justify-center"
      >
        <FiAlertCircle className="w-8 h-8 text-danger" />
      </div>
      <h3 className="text-xl font-semibold text-text dark:text-text-dark mb-2">
        Failed to load jobs
      </h3>
      <p className="text-textSecondary dark:text-textSecondary-dark text-center max-w-md mb-4">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-lg bg-primary text-white
                   hover:bg-primary-dark transition-colors duration-200"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
