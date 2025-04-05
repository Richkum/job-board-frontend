"use client";

import { useState, useEffect, useCallback } from "react";
import { FiSearch, FiSliders } from "react-icons/fi";
import debounce from "lodash/debounce";

interface JobSearchHeaderProps {
  totalJobs: number;
  onSearch: (searchTerm: string) => Promise<void>;
  onOpenMobileFilters?: () => void;
}

export default function JobSearchHeader({
  totalJobs,
  onSearch,
  onOpenMobileFilters,
}: JobSearchHeaderProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (!term.trim()) return; // Don't search if term is empty
      try {
        setIsSearching(true);
        await onSearch(term);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500),
    [onSearch]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Handle input change
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Form submitted, preventing default");
    e.preventDefault();

    try {
      setIsSearching(true);

      // Check if the search term is empty
      if (!searchTerm.trim()) {
        // If search term is empty, load all jobs
        await onSearch("");
      } else {
        await onSearch(searchTerm);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text dark:text-text-dark">
            Available Jobs
          </h1>
          <p className="text-sm text-textSecondary dark:text-textSecondary-dark mt-1">
            {totalJobs.toLocaleString()} opportunities found
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        <button
          onClick={onOpenMobileFilters}
          className="lg:hidden p-2 rounded-lg border border-border dark:border-border-dark
                   hover:bg-bgSecondary dark:hover:bg-bgSecondary-dark
                   text-textSecondary dark:text-textSecondary-dark
                   transition-colors duration-200"
        >
          <FiSliders className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <FiSearch
            className="absolute left-4 top-1/2 transform -translate-y-1/2 
                             text-textMuted dark:text-textMuted-dark w-5 h-5"
          />
          <input
            type="text"
            placeholder="Search jobs by title, company, or keywords..."
            value={searchTerm}
            onChange={handleSearchInput}
            className="w-full pl-12 pr-4 py-3.5 rounded-lg 
                     border border-border dark:border-border-dark
                     bg-white dark:bg-bgCard-dark 
                     text-text dark:text-text-dark
                     placeholder-textMuted dark:placeholder-textMuted-dark
                     focus:outline-none focus:ring-2 focus:ring-primary 
                     focus:border-transparent transition-all duration-200
                     shadow-sm"
          />
        </div>
        {isSearching && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </form>
    </div>
  );
}
