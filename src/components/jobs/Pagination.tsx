"use client";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];
    let l;

    range.push(1);

    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i < totalPages && i > 1) {
        range.push(i);
      }
    }

    range.push(totalPages);

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-border dark:border-border-dark
                 text-textSecondary dark:text-textSecondary-dark
                 hover:bg-bgSecondary dark:hover:bg-bgSecondary-dark
                 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-colors duration-200"
      >
        <FiChevronLeft className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === "..."}
          className={`min-w-[40px] h-10 px-4 rounded-lg border 
                    ${
                      page === currentPage
                        ? "bg-primary border-primary text-white"
                        : "border-border dark:border-border-dark text-textSecondary dark:text-textSecondary-dark hover:bg-bgSecondary dark:hover:bg-bgSecondary-dark"
                    }
                    ${page === "..." ? "cursor-default" : "cursor-pointer"}
                    transition-colors duration-200`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-border dark:border-border-dark
                 text-textSecondary dark:text-textSecondary-dark
                 hover:bg-bgSecondary dark:hover:bg-bgSecondary-dark
                 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-colors duration-200"
      >
        <FiChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
