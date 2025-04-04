"use client";

export default function JobCardSkeleton() {
  return (
    <div
      className="animate-pulse bg-white dark:bg-bgCard-dark rounded-lg
                   border border-border dark:border-border-dark p-6"
    >
      <div className="flex items-start gap-4">
        {/* Company Logo Skeleton */}
        <div className="w-12 h-12 bg-bgSecondary dark:bg-bgSecondary-dark rounded-lg" />

        <div className="flex-grow">
          {/* Title Skeleton */}
          <div className="h-6 bg-bgSecondary dark:bg-bgSecondary-dark rounded-md w-3/4 mb-2" />

          {/* Company Name Skeleton */}
          <div className="h-4 bg-bgSecondary dark:bg-bgSecondary-dark rounded-md w-1/2 mb-1" />

          {/* Subtitle Skeleton */}
          <div className="h-4 bg-bgSecondary dark:bg-bgSecondary-dark rounded-md w-5/6" />
        </div>
      </div>

      {/* Details Grid Skeleton */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-4 h-4 bg-bgSecondary dark:bg-bgSecondary-dark rounded-full" />
            <div className="h-4 bg-bgSecondary dark:bg-bgSecondary-dark rounded-md w-24" />
          </div>
        ))}
      </div>

      {/* Salary Skeleton */}
      <div className="mt-4 flex items-center gap-2">
        <div className="w-4 h-4 bg-bgSecondary dark:bg-bgSecondary-dark rounded-full" />
        <div className="h-4 bg-bgSecondary dark:bg-bgSecondary-dark rounded-md w-32" />
      </div>

      {/* Tags Skeleton */}
      <div className="mt-4 flex flex-wrap gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-6 bg-bgSecondary dark:bg-bgSecondary-dark rounded-full w-16"
          />
        ))}
      </div>
    </div>
  );
}
