"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import JobFilterSidebar from "./JobFilterSidebar";
import { JobFilterType } from "@/types/jobs";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onFilter: (filters: JobFilterType) => void;
  activeFilters: Record<string, any>; // Add activeFilters property
}

export default function MobileFilterDrawer({
  isOpen,
  onClose,
  onFilter,
}: MobileFilterDrawerProps) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-text/20 dark:bg-text-dark/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`absolute inset-y-0 right-0 w-full max-w-sm transform
                     ${isOpen ? "translate-x-0" : "translate-x-full"}
                     transition-transform duration-300 ease-in-out`}
      >
        <JobFilterSidebar
          onFilter={onFilter}
          onClose={onClose}
          isMobile={true}
          className="h-full overflow-y-auto"
          activeFilters={{}}
        />
      </div>
    </div>,
    document.body
  );
}
