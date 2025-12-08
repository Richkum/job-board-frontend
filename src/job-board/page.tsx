"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Briefcase,
  Search,
  TrendingUp,
  MapPin,
  Building2,
  Menu,
  X,
} from "lucide-react";
import LoadingIndicator from "@/components/ui/Loading";
import JobList from "@/components/jobs/JobList";
import { Job } from "@/types/jobs";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getPublicJobs = async (
  page: number = 1,
  limit: number = 10
): Promise<{
  jobs: Job[];
  total: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}> => {
  try {
    const response = await fetch(`${API_URL}/jobs?page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error("Failed to fetch jobs");
    return response.json();
  } catch (error) {
    console.error("Fetch public jobs error:", error);
    throw error;
  }
};

const searchPublicJobs = async (params: {
  search?: string;
  locationTypes?: string[];
  jobTypes?: string[];
  page?: number;
  limit?: number;
}): Promise<{
  jobs: Job[];
  total: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}> => {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            if (item !== null && item !== undefined) {
              queryParams.append(key, item);
            }
          });
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const response = await fetch(
      `${API_URL}/jobs/search?${queryParams.toString()}`
    );
    if (!response.ok) throw new Error("Failed to search jobs");
    return response.json();
  } catch (error) {
    console.error("Search public jobs error:", error);
    throw error;
  }
};

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{
    locationTypes?: string[];
    jobTypes?: string[];
  }>({});
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasMore: false,
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isSearchActive || Object.keys(activeFilters).length > 0) {
      performSearch();
    } else {
      loadJobs();
    }
  }, [filters.page, activeFilters]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await getPublicJobs(filters.page, filters.limit);
      setJobs(response.jobs);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        total: response.total,
        hasMore: response.hasMore,
      });
    } catch (error) {
      console.error("Failed to load jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async () => {
    try {
      setLoading(true);
      const searchParams = {
        ...(searchTerm ? { search: searchTerm } : {}),
        ...activeFilters,
        page: filters.page,
        limit: filters.limit,
      };
      const response = await searchPublicJobs(searchParams);
      setJobs(response.jobs);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        total: response.total,
        hasMore: response.hasMore,
      });
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchActive(!!searchTerm);
    setFilters((prev) => ({ ...prev, page: 1 }));

    if (!searchTerm && Object.keys(activeFilters).length === 0) {
      setIsSearchActive(false);
      loadJobs();
      return;
    }

    try {
      setLoading(true);
      const response = await searchPublicJobs({
        ...(searchTerm ? { search: searchTerm } : {}),
        ...activeFilters,
        page: 1,
        limit: filters.limit,
      });
      setJobs(response.jobs);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        total: response.total,
        hasMore: response.hasMore,
      });
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterClick = (
    filterType: "locationTypes" | "jobTypes",
    value: string
  ) => {
    setActiveFilters((prev) => {
      const currentValues = prev[filterType] || [];
      const isActive = currentValues.includes(value);

      const newValues = isActive
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [filterType]: newValues.length > 0 ? newValues : undefined,
      };
    });

    setFilters((prev) => ({ ...prev, page: 1 }));
    setIsSearchActive(true);
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setActiveFilters({});
    setIsSearchActive(false);
    setFilters((prev) => ({ ...prev, page: 1 }));
    loadJobs();
  };

  const isFilterActive = (
    filterType: "locationTypes" | "jobTypes",
    value: string
  ) => {
    return activeFilters[filterType]?.includes(value) || false;
  };

  const filterButtons = [
    {
      type: "locationTypes" as const,
      value: "remote",
      icon: Building2,
      label: "Remote Jobs",
      count: "1.2k+",
    },
    {
      type: "jobTypes" as const,
      value: "full-time",
      icon: TrendingUp,
      label: "Full-time",
      count: "3.5k+",
    },
    {
      type: "locationTypes" as const,
      value: "on-site",
      icon: MapPin,
      label: "On-site",
      count: "2.1k+",
    },
    {
      type: "jobTypes" as const,
      value: "contract",
      icon: Briefcase,
      label: "Contract",
      count: "890+",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bg dark:bg-bg-dark">
      {/* Navigation */}
      <header className="border-b border-border dark:border-border-dark sticky top-0 z-50 bg-white/80 dark:bg-bg-dark/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="bg-gradient-to-br from-primary to-secondary text-white p-1.5 sm:p-2 rounded-lg shadow-lg group-hover:shadow-xl transition-shadow">
                <Briefcase size={18} className="sm:w-5 sm:h-5" />
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                JobConnect
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <a
                href="#jobs"
                className="text-sm lg:text-base text-textSecondary dark:text-textSecondary-dark hover:text-primary dark:hover:text-primary transition-colors font-medium"
              >
                Find Jobs
              </a>
              <a
                href="#stats"
                className="text-sm lg:text-base text-textSecondary dark:text-textSecondary-dark hover:text-primary dark:hover:text-primary transition-colors font-medium"
              >
                For Employers
              </a>
            </nav>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <ThemeToggle />
              <div className="hidden sm:flex space-x-2 lg:space-x-3">
                <Link
                  href="/login"
                  className="px-3 lg:px-4 py-2 text-sm lg:text-base rounded-lg border border-border dark:border-border-dark text-textSecondary dark:text-textSecondary-dark hover:bg-bgSecondary dark:hover:bg-bgSecondary-dark transition-all"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="px-3 lg:px-4 py-2 text-sm lg:text-base rounded-lg bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white transition-all shadow-lg hover:shadow-xl"
                >
                  Sign Up
                </Link>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden p-2 text-text dark:text-text-dark"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden mt-4 pb-4 space-y-3 border-t border-border dark:border-border-dark pt-4">
              <a
                href="#jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-textSecondary dark:text-textSecondary-dark hover:text-primary transition-colors font-medium"
              >
                Find Jobs
              </a>
              <a
                href="#stats"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-textSecondary dark:text-textSecondary-dark hover:text-primary transition-colors font-medium"
              >
                For Employers
              </a>
              <div className="flex flex-col space-y-2 pt-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-center rounded-lg border border-border dark:border-border-dark text-textSecondary dark:text-textSecondary-dark hover:bg-bgSecondary dark:hover:bg-bgSecondary-dark transition-all"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-center rounded-lg bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white transition-all shadow-lg hover:shadow-xl"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with Background */}
        <section className="relative min-h-[400px] sm:min-h-[500px] flex items-center justify-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1920&q=80"
              alt="Hero background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-secondary/85 to-primary/90 dark:from-primary/95 dark:via-secondary/90 dark:to-primary/95" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg dark:to-bg-dark" />
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 py-12 sm:py-20">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 animate-fade-in leading-tight">
                Discover Your Next
                <span className="block mt-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Career Opportunity
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
                Connect with top employers and explore thousands of job
                opportunities tailored to your skills and aspirations
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-3xl mx-auto px-4">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 bg-white dark:bg-bgCard-dark rounded-xl sm:rounded-2xl p-2 shadow-2xl">
                  <div className="flex-1 flex items-center px-3 sm:px-4 gap-2 sm:gap-3">
                    <Search className="w-4 h-4 sm:w-5 sm:h-5 text-textMuted dark:text-textMuted-dark flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Job title, keywords..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none text-sm sm:text-base text-text dark:text-text-dark placeholder-textMuted dark:placeholder-textMuted-dark py-2 sm:py-3"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl transition-all shadow-lg hover:shadow-xl"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Quick Stats */}
              <div
                id="stats"
                className="mt-8 sm:mt-12 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto px-4"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    {pagination.total}+
                  </div>
                  <div className="text-white/80 text-xs sm:text-sm mt-1">
                    Active Jobs
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    5+
                  </div>
                  <div className="text-white/80 text-xs sm:text-sm mt-1">
                    Companies
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20 col-span-2 sm:col-span-1">
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    10+
                  </div>
                  <div className="text-white/80 text-xs sm:text-sm mt-1">
                    Happy Users
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-8 sm:py-12 bg-bgSecondary dark:bg-bgSecondary-dark">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              {filterButtons.map((filter, index) => (
                <button
                  key={index}
                  onClick={() => handleFilterClick(filter.type, filter.value)}
                  className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border transition-all group ${
                    isFilterActive(filter.type, filter.value)
                      ? "bg-primary text-white border-primary shadow-lg scale-105"
                      : "bg-white dark:bg-bgCard-dark border-border dark:border-border-dark hover:border-primary dark:hover:border-primary hover:shadow-lg"
                  }`}
                >
                  <filter.icon
                    className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                      isFilterActive(filter.type, filter.value)
                        ? "text-white"
                        : "text-primary group-hover:scale-110"
                    }`}
                  />
                  <div className="text-left">
                    <div
                      className={`text-xs sm:text-sm font-semibold ${
                        isFilterActive(filter.type, filter.value)
                          ? "text-white"
                          : "text-text dark:text-text-dark"
                      }`}
                    >
                      {filter.label}
                    </div>
                    <div
                      className={`text-xs hidden sm:block ${
                        isFilterActive(filter.type, filter.value)
                          ? "text-white/80"
                          : "text-textMuted dark:text-textMuted-dark"
                      }`}
                    >
                      {filter.count}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Jobs Listing Section */}
        <section id="jobs" className="py-8 sm:py-16">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-text dark:text-text-dark mb-2">
                    {isSearchActive ? "Search Results" : "Featured Jobs"}
                  </h2>
                  <p className="text-sm sm:text-base text-textSecondary dark:text-textSecondary-dark">
                    {pagination.total.toLocaleString()} opportunities available
                    {searchTerm && ` for "${searchTerm}"`}
                  </p>
                </div>
                {isSearchActive && (
                  <button
                    onClick={handleClearSearch}
                    className="px-4 py-2 text-sm border border-border dark:border-border-dark rounded-lg hover:bg-bgSecondary dark:hover:bg-bgSecondary-dark transition-colors self-start sm:self-auto"
                  >
                    Clear Search
                  </button>
                )}
              </div>
              <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-primary to-secondary rounded-full" />
            </div>

            {/* Jobs Display */}
            <div className="mt-6 sm:mt-8">
              {loading ? (
                <div className="flex justify-center items-center py-12 sm:py-20">
                  <LoadingIndicator />
                </div>
              ) : jobs.length > 0 ? (
                <JobList
                  jobs={jobs}
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              ) : (
                <div className="bg-white dark:bg-bgCard-dark rounded-xl sm:rounded-2xl shadow-lg p-8 sm:p-12 text-center border border-border dark:border-border-dark">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-bgSecondary dark:bg-bgSecondary-dark rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 sm:w-8 sm:h-8 text-textMuted dark:text-textMuted-dark" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-text dark:text-text-dark mb-2">
                    No jobs found
                  </h3>
                  <p className="text-sm sm:text-base text-textSecondary dark:text-textSecondary-dark mb-6">
                    Try adjusting your search criteria or clear your search
                  </p>
                  {isSearchActive && (
                    <button
                      onClick={handleClearSearch}
                      className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border dark:border-border-dark bg-white dark:bg-bgCard-dark">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-primary to-secondary text-white p-1.5 rounded-lg">
                <Briefcase size={16} className="sm:w-[18px] sm:h-[18px]" />
              </div>
              <span className="text-sm sm:text-base font-semibold text-text dark:text-text-dark">
                JobConnect
              </span>
            </div>
            <p className="text-xs sm:text-sm text-textSecondary dark:text-textSecondary-dark text-center">
              &copy; {new Date().getFullYear()} JobConnect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
