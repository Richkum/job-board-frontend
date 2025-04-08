"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getMyApplications } from "@/services/applications.api";
import { ApplicationResponseDto } from "@/types/application";

// Components
import DashboardLayout from "@/components/laoyout/DashboardLayout";
import LoadingIndicator from "@/components/ui/Loading";
import Toast from "@/components/ui/toast.alert";

export default function JobSeekerApplicationPage() {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applications, setApplications] = useState<ApplicationResponseDto[]>(
    []
  );
  const [expandedApp, setExpandedApp] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user || !token) return;

      try {
        const data = await getMyApplications(token);
        setApplications(data.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user, token]);

  const handleApplicationClick = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  const toggleExpand = (appId: string) => {
    if (expandedApp === appId) {
      setExpandedApp(null);
    } else {
      setExpandedApp(appId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "accepted":
        return "bg-green-100 text-green-800 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";
      case "interview":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Unknown date";
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <LoadingIndicator />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Toast type="error" message={error} onClose={() => setError(null)} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Applications
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Track and manage all your job applications in one place
          </p>

          {applications.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-16 w-16 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                No applications yet
              </h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Start applying to jobs to see your applications here.
              </p>
              <button
                onClick={() => router.push("/jobs")}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Browse Jobs
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
                >
                  <div
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 cursor-pointer bg-gray-50 dark:bg-gray-900"
                    onClick={() => toggleExpand(app.id)}
                  >
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                        {app.job.title}
                      </h2>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                            app.status
                          )}`}
                        >
                          {app.status.charAt(0).toUpperCase() +
                            app.status.slice(1)}
                        </span>
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                          Applied: {formatDate(app.createdAt.toString())}
                        </span>
                      </div>
                    </div>
                    <button
                      className="mt-3 sm:mt-0 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150"
                      aria-label={
                        expandedApp === app.id
                          ? "Collapse details"
                          : "Expand details"
                      }
                    >
                      <svg
                        className={`h-6 w-6 transform transition-transform duration-200 ${
                          expandedApp === app.id ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </button>
                  </div>

                  {expandedApp === app.id && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                              Cover Letter
                            </h3>
                            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-gray-700 dark:text-gray-300 whitespace-pre-line text-sm max-h-48 overflow-y-auto">
                              {app.coverLetter ||
                                "You did not provide a cover letter."}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                              Resume Information
                            </h3>
                            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-gray-700 dark:text-gray-300 text-sm">
                              {app.resumeInfo?.content ? (
                                <a
                                  href={app.resumeInfo.content}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  {app.resumeInfo.content}
                                </a>
                              ) : (
                                "You did not provide resume information."
                              )}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                              Portfolio Links
                            </h3>
                            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-gray-700 dark:text-gray-300 text-sm">
                              {app.portfolio?.links &&
                              app.portfolio.links.length > 0 ? (
                                <ul className="list-disc pl-5 space-y-1">
                                  {app.portfolio.links.map(
                                    (link: any, index) => (
                                      <li key={index}>
                                        <a
                                          href={
                                            typeof link === "string"
                                              ? link
                                              : link.url || "#"
                                          }
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                          {typeof link === "string"
                                            ? link
                                            : link.title ||
                                              link.url ||
                                              "Portfolio link"}
                                        </a>
                                      </li>
                                    )
                                  )}
                                </ul>
                              ) : (
                                "You did not provide any portfolio links."
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                              Experience
                            </h3>
                            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-gray-700 dark:text-gray-300 text-sm">
                              {app.relevantExperience &&
                              app.relevantExperience.length > 0 ? (
                                <ul className="list-disc pl-5 space-y-2">
                                  {app.relevantExperience.map((exp, index) => (
                                    <li key={index}>{exp}</li>
                                  ))}
                                </ul>
                              ) : (
                                "You did not provide relevant experience details."
                              )}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                              Application Notes
                            </h3>
                            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-gray-700 dark:text-gray-300 whitespace-pre-line text-sm">
                              {app.notes ||
                                "You did not provide any additional notes."}
                            </div>
                          </div>

                          {app.interviewDate && (
                            <div>
                              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Interview Date
                              </h3>
                              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-gray-700 dark:text-gray-300 text-sm">
                                {formatDate(app.interviewDate.toString())}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={() => handleApplicationClick(app.job.id)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          View Job Details
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
