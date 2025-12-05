"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Briefcase, Search, TrendingUp, MapPin, Building2 } from "lucide-react";
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
        queryParams.append(key, value.toString());
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
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasMore: false,
  });

  useEffect(() => {
    if (isSearchActive) {
      performSearch();
    } else {
      loadJobs();
    }
  }, [filters.page]);

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

    if (!searchTerm) {
      setIsSearchActive(false);
      loadJobs();
      return;
    }

    try {
      setLoading(true);
      const response = await searchPublicJobs({
        search: searchTerm,
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

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setIsSearchActive(false);
    setFilters((prev) => ({ ...prev, page: 1 }));
    loadJobs();
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg dark:bg-bg-dark">
      {/* Navigation */}
      <header className="border-b border-border dark:border-border-dark sticky top-0 z-50 bg-white/80 dark:bg-bg-dark/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-br from-primary to-secondary text-white p-2 rounded-lg shadow-lg group-hover:shadow-xl transition-shadow">
              <Briefcase size={20} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              JobConnect
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#jobs"
              className="text-textSecondary dark:text-textSecondary-dark hover:text-primary dark:hover:text-primary transition-colors font-medium"
            >
              Find Jobs
            </a>
            <a
              href="#stats"
              className="text-textSecondary dark:text-textSecondary-dark hover:text-primary dark:hover:text-primary transition-colors font-medium"
            >
              For Employers
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="hidden md:flex space-x-3">
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg border border-border dark:border-border-dark text-textSecondary dark:text-textSecondary-dark hover:bg-bgSecondary dark:hover:bg-bgSecondary-dark transition-all"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white transition-all shadow-lg hover:shadow-xl"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with Background */}
        <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
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
          <div className="relative z-10 container mx-auto px-4 py-20">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
                Discover Your Next
                <span className="block mt-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Career Opportunity
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                Connect with top employers and explore thousands of job
                opportunities tailored to your skills and aspirations
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-bgCard-dark rounded-2xl p-2 shadow-2xl">
                  <div className="flex-1 flex items-center px-4 gap-3">
                    <Search className="w-5 h-5 text-textMuted dark:text-textMuted-dark flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Job title, keywords, or company..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none text-text dark:text-text-dark placeholder-textMuted dark:placeholder-textMuted-dark py-3"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
                  >
                    Search Jobs
                  </button>
                </div>
              </form>

              {/* Quick Stats */}
              <div
                id="stats"
                className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-3xl font-bold text-white">
                    {pagination.total}+
                  </div>
                  <div className="text-white/80 text-sm mt-1">Active Jobs</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-3xl font-bold text-white">5+</div>
                  <div className="text-white/80 text-sm mt-1">Companies</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 col-span-2 md:col-span-1">
                  <div className="text-3xl font-bold text-white">10+</div>
                  <div className="text-white/80 text-sm mt-1">Happy Users</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-12 bg-bgSecondary dark:bg-bgSecondary-dark">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: Building2, label: "Remote Jobs", count: "1.2k+" },
                { icon: TrendingUp, label: "Full-time", count: "3.5k+" },
                { icon: MapPin, label: "On-site", count: "2.1k+" },
                { icon: Briefcase, label: "Contract", count: "890+" },
              ].map((category, index) => (
                <button
                  key={index}
                  className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-bgCard-dark rounded-xl border border-border dark:border-border-dark hover:border-primary dark:hover:border-primary hover:shadow-lg transition-all group"
                >
                  <category.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="text-sm font-semibold text-text dark:text-text-dark">
                      {category.label}
                    </div>
                    <div className="text-xs text-textMuted dark:text-textMuted-dark">
                      {category.count}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Jobs Listing Section */}
        <section id="jobs" className="py-16">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-text dark:text-text-dark mb-2">
                    {isSearchActive ? "Search Results" : "Featured Jobs"}
                  </h2>
                  <p className="text-textSecondary dark:text-textSecondary-dark">
                    {pagination.total.toLocaleString()} opportunities available
                    {searchTerm && ` for "${searchTerm}"`}
                  </p>
                </div>
                {isSearchActive && (
                  <button
                    onClick={handleClearSearch}
                    className="px-4 py-2 text-sm border border-border dark:border-border-dark rounded-lg hover:bg-bgSecondary dark:hover:bg-bgSecondary-dark transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
              <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full" />
            </div>

            {/* Jobs Display */}
            <div className="mt-8">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <LoadingIndicator />
                </div>
              ) : jobs.length > 0 ? (
                <JobList
                  jobs={jobs}
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              ) : (
                <div className="bg-white dark:bg-bgCard-dark rounded-2xl shadow-lg p-12 text-center border border-border dark:border-border-dark">
                  <div className="w-16 h-16 bg-bgSecondary dark:bg-bgSecondary-dark rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-textMuted dark:text-textMuted-dark" />
                  </div>
                  <h3 className="text-xl font-semibold text-text dark:text-text-dark mb-2">
                    No jobs found
                  </h3>
                  <p className="text-textSecondary dark:text-textSecondary-dark mb-6">
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
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-primary to-secondary text-white p-1.5 rounded-lg">
                <Briefcase size={18} />
              </div>
              <span className="font-semibold text-text dark:text-text-dark">
                JobConnect
              </span>
            </div>
            <p className="text-sm text-textSecondary dark:text-textSecondary-dark">
              &copy; {new Date().getFullYear()} JobConnect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
