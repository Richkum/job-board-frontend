"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Search,
  Briefcase,
  Building2,
  Users,
  CheckCircle,
  PenTool,
  MapPin,
  Clock,
  ArrowRight,
  Heart,
  Star,
  GitMerge,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import LoadingIndicator from "@/components/ui/Loading";

export default function LandingPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b border-border dark:border-border-dark sticky top-0 z-50 bg-bg dark:bg-bg-dark backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-primary text-white p-1.5 rounded">
              <Briefcase size={20} />
            </div>
            <span className="text-xl font-bold text-text dark:text-text-dark">
              JobConnect
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#Featured-Jobs"
              className="text-textSecondary dark:text-textSecondary-dark hover:text-primary dark:hover:text-primary transition-colors"
            >
              Find Jobs
            </Link>
            <Link
              href="#Featured-Jobs"
              className="text-textSecondary dark:text-textSecondary-dark hover:text-primary dark:hover:text-primary transition-colors"
            >
              For Employers
            </Link>
            <Link
              href="#how-it works"
              className="text-textSecondary dark:text-textSecondary-dark hover:text-primary dark:hover:text-primary transition-colors"
            >
              How It Works
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="hidden md:flex space-x-3">
              <Link
                href="/login"
                className="px-4 py-2 rounded border border-border dark:border-border-dark text-textSecondary dark:text-textSecondary-dark hover:bg-bgSecondary dark:hover:bg-bgSecondary-dark transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded bg-primary hover:bg-primary-dark text-white transition-colors"
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden text-text dark:text-text-dark">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-12 md:py-20 bg-gradient-to-br from-bg to-bgSecondary dark:from-bg-dark dark:to-bgSecondary-dark">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <motion.div
                className="md:w-1/2 mb-10 md:mb-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl md:text-5xl font-bold mb-4 text-text dark:text-text-dark leading-tight">
                  Find Your Dream Job or{" "}
                  <span className="text-primary">Ideal Candidate</span>
                </h1>
                <p className="text-textSecondary dark:text-textSecondary-dark text-lg mb-8 max-w-xl">
                  Connect with top companies and talent. JobConnect helps you
                  navigate your career path or build your dream team.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/find-jobs"
                    className="px-6 py-3 rounded bg-primary hover:bg-primary-dark text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <Search size={18} />
                    Find Jobs
                  </Link>
                  <Link
                    href="/post-job"
                    className="px-6 py-3 rounded border border-primary text-primary hover:bg-primary-light dark:hover:bg-transparent dark:hover:text-white dark:hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                  >
                    <Briefcase size={18} />
                    Post a Job
                  </Link>
                </div>
              </motion.div>

              <motion.div
                className="md:w-1/2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative bg-bgCard dark:bg-bgCard-dark rounded-lg shadow-xl p-8 border border-border dark:border-border-dark">
                  <h3 className="text-xl font-semibold mb-4 text-text dark:text-text-dark">
                    Quick Job Search
                  </h3>

                  <div className="space-y-4">
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-3 text-textSecondary dark:text-textSecondary-dark"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="Job title, keywords, or company"
                        className="w-full px-10 py-3 rounded border border-border dark:border-border-dark bg-bg dark:bg-bg-dark focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="relative">
                      <MapPin
                        className="absolute left-3 top-3 text-textSecondary dark:text-textSecondary-dark"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="Location or Remote"
                        className="w-full px-10 py-3 rounded border border-border dark:border-border-dark bg-bg dark:bg-bg-dark focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <button className="w-full px-6 py-3 rounded bg-primary hover:bg-primary-dark text-white transition-colors flex items-center justify-center gap-2">
                      <Search size={18} />
                      Search Jobs
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm text-textSecondary dark:text-textSecondary-dark">
                    <span>Popular: </span>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-bgSecondary dark:bg-bgSecondary-dark hover:bg-primary-light hover:text-primary dark:hover:bg-primary-dark/20 cursor-pointer transition-colors">
                        Remote
                      </span>
                      <span className="px-3 py-1 rounded-full bg-bgSecondary dark:bg-bgSecondary-dark hover:bg-primary-light hover:text-primary dark:hover:bg-primary-dark/20 cursor-pointer transition-colors">
                        Full-time
                      </span>
                      <span className="px-3 py-1 rounded-full bg-bgSecondary dark:bg-bgSecondary-dark hover:bg-primary-light hover:text-primary dark:hover:bg-primary-dark/20 cursor-pointer transition-colors">
                        Tech
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-bgSecondary dark:bg-bgSecondary-dark">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-6">
                <h3 className="text-3xl font-bold text-primary mb-2">10k+</h3>
                <p className="text-textSecondary dark:text-textSecondary-dark">
                  Active Jobs
                </p>
              </div>
              <div className="p-6">
                <h3 className="text-3xl font-bold text-primary mb-2">5k+</h3>
                <p className="text-textSecondary dark:text-textSecondary-dark">
                  Companies
                </p>
              </div>
              <div className="p-6">
                <h3 className="text-3xl font-bold text-primary mb-2">25k+</h3>
                <p className="text-textSecondary dark:text-textSecondary-dark">
                  Job Seekers
                </p>
              </div>
              <div className="p-6">
                <h3 className="text-3xl font-bold text-primary mb-2">95%</h3>
                <p className="text-textSecondary dark:text-textSecondary-dark">
                  Success Rate
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-text dark:text-text-dark">
                Why Choose JobConnect
              </h2>
              <p className="text-textSecondary dark:text-textSecondary-dark max-w-2xl mx-auto">
                Our platform offers unique advantages for both job seekers and
                employers to make the hiring process seamless and effective.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <motion.div
                className="bg-bgCard dark:bg-bgCard-dark rounded-lg p-6 border border-border dark:border-border-dark"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="bg-primary-light dark:bg-primary-dark/20 p-3 rounded-lg inline-block mb-4">
                  <Search className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-text dark:text-text-dark">
                  Smart Job Matching
                </h3>
                <p className="text-textSecondary dark:text-textSecondary-dark">
                  Our AI-powered system matches your skills and preferences with
                  the perfect job opportunities.
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                className="bg-bgCard dark:bg-bgCard-dark rounded-lg p-6 border border-border dark:border-border-dark"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="bg-primary-light dark:bg-primary-dark/20 p-3 rounded-lg inline-block mb-4">
                  <Building2 className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-text dark:text-text-dark">
                  Verified Companies
                </h3>
                <p className="text-textSecondary dark:text-textSecondary-dark">
                  All employers on our platform are verified to ensure
                  legitimate and high-quality job listings.
                </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                className="bg-bgCard dark:bg-bgCard-dark rounded-lg p-6 border border-border dark:border-border-dark"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="bg-primary-light dark:bg-primary-dark/20 p-3 rounded-lg inline-block mb-4">
                  <Clock className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-text dark:text-text-dark">
                  Real-time Updates
                </h3>
                <p className="text-textSecondary dark:text-textSecondary-dark">
                  Get instant notifications about new job postings and
                  application status changes.
                </p>
              </motion.div>

              {/* Feature 4 */}
              <motion.div
                className="bg-bgCard dark:bg-bgCard-dark rounded-lg p-6 border border-border dark:border-border-dark"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="bg-primary-light dark:bg-primary-dark/20 p-3 rounded-lg inline-block mb-4">
                  <Users className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-text dark:text-text-dark">
                  Talent Pool Access
                </h3>
                <p className="text-textSecondary dark:text-textSecondary-dark">
                  Employers can browse through pre-screened candidates with
                  verified skills and experience.
                </p>
              </motion.div>

              {/* Feature 5 */}
              <motion.div
                className="bg-bgCard dark:bg-bgCard-dark rounded-lg p-6 border border-border dark:border-border-dark"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="bg-primary-light dark:bg-primary-dark/20 p-3 rounded-lg inline-block mb-4">
                  <PenTool className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-text dark:text-text-dark">
                  Resume Builder
                </h3>
                <p className="text-textSecondary dark:text-textSecondary-dark">
                  Create a professional resume with our easy-to-use tools and
                  templates optimized for ATS systems.
                </p>
              </motion.div>

              {/* Feature 6 */}
              <motion.div
                className="bg-bgCard dark:bg-bgCard-dark rounded-lg p-6 border border-border dark:border-border-dark"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="bg-primary-light dark:bg-primary-dark/20 p-3 rounded-lg inline-block mb-4">
                  <GitMerge className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-text dark:text-text-dark">
                  Application Tracking
                </h3>
                <p className="text-textSecondary dark:text-textSecondary-dark">
                  Keep track of all your applications in one place, with status
                  updates and follow-up reminders.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it works"
          className="py-16 bg-bgSecondary dark:bg-bgSecondary-dark"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-text dark:text-text-dark">
                How JobConnect Works
              </h2>
              <p className="text-textSecondary dark:text-textSecondary-dark max-w-2xl mx-auto">
                Our simple process helps you find the perfect job or candidate
                in just a few steps.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                className="space-y-10"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 bg-primary text-white h-10 w-10 rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-text dark:text-text-dark">
                      Create Your Profile
                    </h3>
                    <p className="text-textSecondary dark:text-textSecondary-dark">
                      Sign up and complete your profile with your skills,
                      experience, and preferences.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 bg-primary text-white h-10 w-10 rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-text dark:text-text-dark">
                      Explore Opportunities
                    </h3>
                    <p className="text-textSecondary dark:text-textSecondary-dark">
                      Browse through job listings or qualified candidates based
                      on your needs.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 bg-primary text-white h-10 w-10 rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-text dark:text-text-dark">
                      Apply or Connect
                    </h3>
                    <p className="text-textSecondary dark:text-textSecondary-dark">
                      Submit applications or reach out to potential candidates
                      directly through our platform.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 bg-primary text-white h-10 w-10 rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-text dark:text-text-dark">
                      Interview & Hire
                    </h3>
                    <p className="text-textSecondary dark:text-textSecondary-dark">
                      Schedule interviews, make offers, and finalize the hiring
                      process all in one place.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-bgCard dark:bg-bgCard-dark rounded-lg p-8 border border-border dark:border-border-dark shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="rounded-lg overflow-hidden mb-6">
                  <img
                    src="/api/placeholder/800/500"
                    alt="JobConnect platform preview"
                    className="w-full h-auto"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-success" size={20} />
                    <p className="text-text dark:text-text-dark">
                      80% faster hiring process
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-success" size={20} />
                    <p className="text-text dark:text-text-dark">
                      65% better candidate matches
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-success" size={20} />
                    <p className="text-text dark:text-text-dark">
                      Free for job seekers
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-success" size={20} />
                    <p className="text-text dark:text-text-dark">
                      Affordable plans for employers
                    </p>
                  </div>
                </div>
                <div className="mt-8">
                  <Link
                    href="/signup"
                    className="block w-full text-center px-6 py-3 rounded bg-primary hover:bg-primary-dark text-white transition-colors"
                  >
                    Get Started Now
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Jobs Section */}
        <section id="Featured-Jobs" className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-text dark:text-text-dark">
                Featured Jobs
              </h2>
              <Link
                href="/jobs"
                className="text-primary flex items-center gap-1 hover:underline"
              >
                View all jobs <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Job Card 1 */}
              <motion.div
                className="bg-bgCard dark:bg-bgCard-dark rounded-lg p-6 border border-border dark:border-border-dark relative"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="absolute top-4 right-4">
                  <Heart
                    className="text-textMuted dark:text-textMuted-dark hover:text-danger cursor-pointer"
                    size={20}
                  />
                </div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-bgSecondary dark:bg-bgSecondary-dark rounded-lg flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">
                      TC
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text dark:text-text-dark">
                      Senior Frontend Developer
                    </h3>
                    <p className="text-textSecondary dark:text-textSecondary-dark text-sm">
                      TechCorp Inc.
                    </p>
                  </div>
                </div>
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-2 text-sm text-textSecondary dark:text-textSecondary-dark">
                    <MapPin size={16} />
                    <span>Remote (US)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-textSecondary dark:text-textSecondary-dark">
                    <Briefcase size={16} />
                    <span>Full-time</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <span className="font-medium">$120,000 - $150,000</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="text-xs px-2 py-1 rounded-full bg-bgSecondary dark:bg-bgSecondary-dark text-textSecondary dark:text-textSecondary-dark">
                    React
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-bgSecondary dark:bg-bgSecondary-dark text-textSecondary dark:text-textSecondary-dark">
                    TypeScript
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-bgSecondary dark:bg-bgSecondary-dark text-textSecondary dark:text-textSecondary-dark">
                    Next.js
                  </span>
                </div>
                <Link
                  href="/jobs/senior-frontend-developer"
                  className="block w-full text-center px-4 py-2 rounded border border-primary text-primary hover:bg-primary-light dark:hover:bg-primary-dark/20 transition-colors"
                >
                  View Details
                </Link>
              </motion.div>

              {/* Job Card 2 */}
              <motion.div
                className="bg-bgCard dark:bg-bgCard-dark rounded-lg p-6 border border-border dark:border-border-dark relative"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="absolute top-4 right-4">
                  <Heart
                    className="text-textMuted dark:text-textMuted-dark hover:text-danger cursor-pointer"
                    size={20}
                  />
                </div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-bgSecondary dark:bg-bgSecondary-dark rounded-lg flex items-center justify-center">
                    <span className="text-lg font-semibold text-secondary">
                      DS
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text dark:text-text-dark">
                      UX/UI Designer
                    </h3>
                    <p className="text-textSecondary dark:text-textSecondary-dark text-sm">
                      DesignSphere
                    </p>
                  </div>
                </div>
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-2 text-sm text-textSecondary dark:text-textSecondary-dark">
                    <MapPin size={16} />
                    <span>New York, NY (Hybrid)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-textSecondary dark:text-textSecondary-dark">
                    <Briefcase size={16} />
                    <span>Full-time</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <span className="font-medium">$90,000 - $115,000</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="text-xs px-2 py-1 rounded-full bg-bgSecondary dark:bg-bgSecondary-dark text-textSecondary dark:text-textSecondary-dark">
                    Figma
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-bgSecondary dark:bg-bgSecondary-dark text-textSecondary dark:text-textSecondary-dark">
                    UI/UX
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-bgSecondary dark:bg-bgSecondary-dark text-textSecondary dark:text-textSecondary-dark">
                    Adobe XD
                  </span>
                </div>
                <Link
                  href="/jobs/ux-ui-designer"
                  className="block w-full text-center px-4 py-2 rounded border border-primary text-primary hover:bg-primary-light dark:hover:bg-primary-dark/20 transition-colors"
                >
                  View Details
                </Link>
              </motion.div>

              {/* Job Card 3 */}
              <motion.div
                className="bg-bgCard dark:bg-bgCard-dark rounded-lg p-6 border border-border dark:border-border-dark relative"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="absolute top-4 right-4">
                  <Heart
                    className="text-textMuted dark:text-textMuted-dark hover:text-danger cursor-pointer"
                    size={20}
                  />
                </div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-bgSecondary dark:bg-bgSecondary-dark rounded-lg flex items-center justify-center">
                    <span className="text-lg font-semibold text-accent">
                      GH
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text dark:text-text-dark">
                      DevOps Engineer
                    </h3>
                    <p className="text-textSecondary dark:text-textSecondary-dark text-sm">
                      GlobalHost Solutions
                    </p>
                  </div>
                </div>
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-2 text-sm text-textSecondary dark:text-textSecondary-dark">
                    <MapPin size={16} />
                    <span>Remote (Worldwide)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-textSecondary dark:text-textSecondary-dark">
                    <Briefcase size={16} />
                    <span>Full-time</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <span className="font-medium">$110,000 - $140,000</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="text-xs px-2 py-1 rounded-full bg-bgSecondary dark:bg-bgSecondary-dark text-textSecondary dark:text-textSecondary-dark">
                    AWS
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-bgSecondary dark:bg-bgSecondary-dark text-textSecondary dark:text-textSecondary-dark">
                    Kubernetes
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-bgSecondary dark:bg-bgSecondary-dark text-textSecondary dark:text-textSecondary-dark">
                    CI/CD
                  </span>
                </div>
                <Link
                  href="/jobs/devops-engineer"
                  className="block w-full text-center px-4 py-2 rounded border border-primary text-primary hover:bg-primary-light dark:hover:bg-primary-dark/20 transition-colors"
                >
                  View Details
                </Link>
              </motion.div>
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 px-6 py-3 rounded bg-primary hover:bg-primary-dark text-white transition-colors"
              >
                Browse All Jobs <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-bgSecondary dark:bg-bgSecondary-dark">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-text dark:text-text-dark">
                What Our Users Say
              </h2>
              <p className="text-textSecondary dark:text-textSecondary-dark max-w-2xl mx-auto">
                Read testimonials from job seekers and employers who found
                success with JobConnect.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <motion.div
                className="bg-bgCard dark:bg-bgCard-dark rounded-lg p-6 border border-border dark:border-border-dark"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="flex items-center mb-4">
                  <Star
                    className="text-warning"
                    size={20}
                    fill="currentColor"
                  />
                  <Star
                    className="text-warning"
                    size={20}
                    fill="currentColor"
                  />
                  <Star
                    className="text-warning"
                    size={20}
                    fill="currentColor"
                  />
                  <Star
                    className="text-warning"
                    size={20}
                    fill="currentColor"
                  />
                  <Star
                    className="text-warning"
                    size={20}
                    fill="currentColor"
                  />
                </div>
                <p className="text-textSecondary dark:text-textSecondary-dark italic mb-6">
                  "I found my dream job at a tech startup within 2 weeks of
                  using JobConnect. The matching algorithm is incredibly
                  accurate and saved me so much time!"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-bgSecondary dark:bg-bgSecondary-dark flex items-center justify-center text-primary font-medium">
                    JS
                  </div>
                  <div>
                    <h4 className="font-medium text-text dark:text-text-dark">
                      Jessica Smith
                    </h4>
                    <p className="text-sm text-textSecondary dark:text-textSecondary-dark">
                      Software Engineer
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Testimonial 2 */}
              <motion.div
                className="bg-bgCard dark:bg-bgCard-dark rounded-lg p-6 border border-border dark:border-border-dark"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="flex items-center mb-4">
                  <Star
                    className="text-warning"
                    size={20}
                    fill="currentColor"
                  />
                  <Star
                    className="text-warning"
                    size={20}
                    fill="currentColor"
                  />
                  <Star
                    className="text-warning"
                    size={20}
                    fill="currentColor"
                  />
                  <Star
                    className="text-warning"
                    size={20}
                    fill="currentColor"
                  />
                  <Star
                    className="text-warning"
                    size={20}
                    fill="currentColor"
                  />
                </div>
                <p className="text-textSecondary dark:text-textSecondary-dark italic mb-6">
                  "As a hiring manager, JobConnect has streamlined our
                  recruitment process tremendously. We've reduced our hiring
                  time by 60% and found better quality candidates."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-bgSecondary dark:bg-bgSecondary-dark flex items-center justify-center text-secondary font-medium">
                    MJ
                  </div>
                  <div>
                    <h4 className="font-medium text-text dark:text-text-dark">
                      Michael Johnson
                    </h4>
                    <p className="text-sm text-textSecondary dark:text-textSecondary-dark">
                      HR Director
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Testimonial 3 */}
              <motion.div
                className="bg-bgCard dark:bg-bgCard-dark rounded-lg p-6 border border-border dark:border-border-dark"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div id="testimonial" className="flex items-center mb-4">
                  <Star
                    className="text-warning"
                    size={20}
                    fill="currentColor"
                  />
                  <Star
                    className="text-warning"
                    size={20}
                    fill="currentColor"
                  />
                  <Star
                    className="text-warning"
                    size={20}
                    fill="currentColor"
                  />
                  <Star
                    className="text-warning"
                    size={20}
                    fill="currentColor"
                  />
                  <Star
                    className="text-warning"
                    size={20}
                    fill="currentColor"
                  />
                </div>
                <p className="text-textSecondary dark:text-textSecondary-dark italic mb-6">
                  "After struggling for months with other job boards, I switched
                  to JobConnect and received three interview requests within
                  days. The platform is intuitive and powerful."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-bgSecondary dark:bg-bgSecondary-dark flex items-center justify-center text-accent font-medium">
                    AP
                  </div>
                  <div>
                    <h4 className="font-medium text-text dark:text-text-dark">
                      Aisha Patel
                    </h4>
                    <p className="text-sm text-textSecondary dark:text-textSecondary-dark">
                      Marketing Specialist
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-8 md:p-12 text-white">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Transform Your Career or Hiring Process?
                </h2>
                <p className="text-white/80 mb-8">
                  Join thousands of professionals and companies who trust
                  JobConnect. Start your journey today!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/signup?type=jobseeker"
                    className="px-6 py-3 rounded bg-white text-primary hover:bg-white/90 transition-colors font-medium"
                  >
                    Find a Job
                  </Link>
                  <Link
                    href="/signup?type=employer"
                    className="px-6 py-3 rounded border border-white text-white hover:bg-white/10 transition-colors font-medium"
                  >
                    Post a Job
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-bgSecondary dark:bg-bgSecondary-dark border-t border-border dark:border-border-dark mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="bg-primary text-white p-1.5 rounded">
                  <Briefcase size={20} />
                </div>
                <span className="text-xl font-bold text-text dark:text-text-dark">
                  JobConnect
                </span>
              </div>
              <p className="text-textSecondary dark:text-textSecondary-dark mb-6">
                Connecting talent with opportunity. Your career journey starts
                here.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-textSecondary dark:text-textSecondary-dark hover:text-primary dark:hover:text-primary transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-textSecondary dark:text-textSecondary-dark hover:text-primary dark:hover:text-primary transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-textSecondary dark:text-textSecondary-dark hover:text-primary dark:hover:text-primary transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-textSecondary dark:text-textSecondary-dark hover:text-primary dark:hover:text-primary transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      ry="5"
                    ></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-text dark:text-text-dark mb-4">
                For Job Seekers
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-textSecondary dark:text-textSecondary-dark hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-textSecondary dark:text-textSecondary-dark hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    Career Resources
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-textSecondary dark:text-textSecondary-dark hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    Resume Builder
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-textSecondary dark:text-textSecondary-dark hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    Salary Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-textSecondary dark:text-textSecondary-dark hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    Job Alerts
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-text dark:text-text-dark mb-4">
                For Employers
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-textSecondary dark:text-textSecondary-dark hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    Post a Job
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-textSecondary dark:text-textSecondary-dark hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    Browse Candidates
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-textSecondary dark:text-textSecondary-dark hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    Pricing Plans
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-textSecondary dark:text-textSecondary-dark hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    Recruitment Tools
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-textSecondary dark:text-textSecondary-dark hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    Success Stories
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-text dark:text-text-dark mb-4">
                Company
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-textSecondary dark:text-textSecondary-dark hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-textSecondary dark:text-textSecondary-dark hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-textSecondary dark:text-textSecondary-dark hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-textSecondary dark:text-textSecondary-dark hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-textSecondary dark:text-textSecondary-dark hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border dark:border-border-dark mt-12 pt-8 text-center text-textSecondary dark:text-textSecondary-dark">
            <p>© {new Date().getFullYear()} JobConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
