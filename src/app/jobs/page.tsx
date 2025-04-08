"use client";

import { useEffect, useState } from "react";
import LoadingIndicator from "@/components/ui/Loading";
import Toast, { ToastType } from "@/components/ui/toast.alert";
import { useAuth } from "@/context/AuthContext";
import JobList from "@/components/jobs/JobList";
import JobSearchHeader from "@/components/jobs/JobSearchHeader";
import { getActiveJobs, searchJobs } from "@/services/job.api";
import JobFilterSidebar from "@/components/jobs/JobFilterSidebar";
import MobileFilterDrawer from "@/components/jobs/MobileFilterDrawer";
import JobCardSkeleton from "@/components/jobs/JobCardSkeleton";
import { Job } from "@/types/jobs";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/laoyout/DashboardLayout";
import ErrorState from "@/components/ErrorState";

export default function JobsPage() {
  const { token, isAuthenticated, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState({});

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasMore: false,
  });

  // Toast state
  const [toast, setToast] = useState<{
    show: boolean;
    type: ToastType;
    message: string;
  }>({
    show: false,
    type: "info",
    message: "",
  });

  const showToast = (type: ToastType, message: string) => {
    setToast({ show: true, type, message });
  };

  // Load initial jobs or fetch based on filters
  useEffect(() => {
    if (!authLoading && isAuthenticated && token) {
      if (isSearchActive) {
        performSearch();
      } else {
        loadJobs();
      }
    }
  }, [filters.page, authLoading, isAuthenticated, token]);

  // Separate effect for handling pagination with active search/filters
  useEffect(() => {
    if (isSearchActive && token && filters.page > 1) {
      performSearch();
    }
  }, [filters.page]);

  const loadJobs = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await getActiveJobs(filters.page, filters.limit, token);

      setJobs(response.jobs as unknown as Job[]);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        total: response.total,
        hasMore: response.hasMore,
      });
    } catch (error) {
      console.error("Failed to load jobs:", error);
      showToast("error", "Failed to load jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const searchParams = {
        ...(searchTerm ? { search: searchTerm } : {}),
        ...activeFilters,
        page: filters.page,
        limit: filters.limit,
      };

      const response = await searchJobs(searchParams, token);

      setJobs(response.jobs as unknown as Job[]);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        total: response.total,
        hasMore: response.hasMore,
      });
    } catch (error) {
      console.error("Search failed:", error);
      showToast("error", "Failed to search jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (newSearchTerm: string) => {
    if (!token) return;

    setSearchTerm(newSearchTerm);
    setIsSearchActive(!!newSearchTerm);
    setFilters((prev) => ({ ...prev, page: 1 }));

    if (!newSearchTerm) {
      // If search term is cleared, reset to default view
      setIsSearchActive(false);
      loadJobs();
      return;
    }

    try {
      setLoading(true);
      const searchParams = {
        search: newSearchTerm,
        ...activeFilters,
        page: 1,
        limit: filters.limit,
      };

      const response = await searchJobs(searchParams, token);

      setJobs(response.jobs as unknown as Job[]);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        total: response.total,
        hasMore: response.hasMore,
      });
    } catch (error) {
      console.error("Search failed:", error);
      showToast("error", "Failed to search jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (newFilters: any) => {
    if (!token) return;

    setActiveFilters(newFilters);
    setIsSearchActive(true);
    setFilters((prev) => ({ ...prev, page: 1 }));

    try {
      setLoading(true);
      const searchParams = {
        ...(searchTerm ? { search: searchTerm } : {}),
        ...newFilters,
        page: 1,
        limit: filters.limit,
      };

      const response = await searchJobs(searchParams, token);

      setJobs(response.jobs as unknown as Job[]);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        total: response.total,
        hasMore: response.hasMore,
      });
    } catch (error) {
      console.error("Filter failed:", error);
      showToast("error", "Failed to apply filters. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setActiveFilters({});
    setIsSearchActive(false);
    setFilters((prev) => ({ ...prev, page: 1 }));
    loadJobs();
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen 
                    bg-bg dark:bg-bg-dark"
      >
        <h2 className="text-2xl font-bold text-text dark:text-text-dark mb-4">
          Please login to view jobs
        </h2>
        <p className="text-textSecondary dark:text-textSecondary-dark">
          You need to be logged in to access this page
        </p>
      </div>
    );
  }

  return (
    <>
      <ProtectedRoute>
        <DashboardLayout>
          <div className="min-h-screen bg-bg dark:bg-bg-dark">
            {toast.show && (
              <Toast
                type={toast.type}
                message={toast.message}
                onClose={() => setToast((prev) => ({ ...prev, show: false }))}
              />
            )}

            <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
              <JobSearchHeader
                totalJobs={pagination.total}
                onSearch={handleSearch}
                onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
                searchTerm={searchTerm}
                isSearchActive={isSearchActive}
                onClearSearch={handleClearSearch}
              />

              <div className="mt-4 sm:mt-8 grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
                {/* Desktop Filters */}
                <div className="hidden lg:block">
                  <JobFilterSidebar
                    onFilter={handleFilter}
                    activeFilters={activeFilters}
                  />
                </div>

                {/* Mobile Filter Drawer */}
                <MobileFilterDrawer
                  isOpen={isMobileFilterOpen}
                  onClose={() => setIsMobileFilterOpen(false)}
                  onFilter={handleFilter}
                  activeFilters={activeFilters}
                />

                {/* Job Listings */}
                <div className="lg:col-span-3">
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <JobCardSkeleton key={i} />
                      ))}
                    </div>
                  ) : jobs.length > 0 ? (
                    <JobList
                      jobs={jobs}
                      pagination={pagination}
                      onPageChange={handlePageChange}
                    />
                  ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
                      <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        No jobs found
                      </p>
                      {isSearchActive && (
                        <button
                          onClick={handleClearSearch}
                          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    </>
  );
}
