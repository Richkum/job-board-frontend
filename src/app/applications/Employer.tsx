"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  getAllJobsApplications,
  updateApplicationStatus,
} from "@/services/applications.api";
import {
  ApplicationResponseDto,
  UpdateApplicationStatusDto,
} from "@/types/application";

// Components
import DashboardLayout from "@/components/laoyout/DashboardLayout";
import LoadingIndicator from "@/components/ui/Loading";
import Toast from "@/components/ui/toast.alert";

export default function EmployerApplicationPage() {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: string; message: string } | null>(
    null
  );
  const [applications, setApplications] = useState<ApplicationResponseDto[]>(
    []
  );
  const [expandedApp, setExpandedApp] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user || !token) return;

      try {
        const data = await getAllJobsApplications(token);
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

  const handleStatusUpdate = async (
    applicationId: string,
    status: string,
    interviewDate?: string
  ) => {
    if (!token) return;

    setUpdatingStatus(applicationId);

    try {
      const updateData: UpdateApplicationStatusDto = {
        status: status as "reviewing" | "accepted" | "rejected",
      };

      if (status === "interview" && interviewDate) {
        updateData.interviewDate = new Date(interviewDate);
      }

      const updatedApplication = await updateApplicationStatus(
        applicationId,
        updateData,
        token
      );

      // Update the applications list with the updated application
      setApplications(
        applications.map((app) =>
          app.id === applicationId ? updatedApplication : app
        )
      );

      setToast({
        type: "success",
        message: `Application status updated to ${status}`,
      });
    } catch (err: any) {
      setToast({
        type: "error",
        message: err.message || "Failed to update application status",
      });
    } finally {
      setUpdatingStatus(null);
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
        {toast && (
          <Toast
            type={toast.type as "success" | "error" | "warning" | "info"}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Job Applications
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Review and manage applications for your job listings
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
                No one has applied to your jobs yet. Check back later.
              </p>
              <button
                onClick={() => router.push("/employer/jobs/create")}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create a New Job
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
                        {app.job.title} - {app.user?.name}
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
                              {app.coverLetter || "No cover letter provided."}
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
                                "No resume information provided."
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
                                "No portfolio links provided."
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
                                "No relevant experience details provided."
                              )}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                              Application Notes
                            </h3>
                            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-gray-700 dark:text-gray-300 whitespace-pre-line text-sm">
                              {app.notes || "No additional notes provided."}
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

                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                              Applicant Contact
                            </h3>
                            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-gray-700 dark:text-gray-300 text-sm">
                              <p>Email: {app.user?.email}</p>
                              {/* {app.user?.phone && <p>Phone: {app.user.phone}</p>} */}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Application Status Management */}
                      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                          Update Application Status
                        </h3>

                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() =>
                              handleStatusUpdate(app.id, "pending")
                            }
                            disabled={
                              app.status === "pending" ||
                              updatingStatus === app.id
                            }
                            className={`px-4 py-2 rounded-md text-sm font-medium border ${
                              app.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 border-yellow-300 opacity-50 cursor-not-allowed"
                                : "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200"
                            }`}
                          >
                            Pending
                          </button>

                          <button
                            onClick={() =>
                              handleStatusUpdate(app.id, "accepted")
                            }
                            disabled={
                              app.status === "accepted" ||
                              updatingStatus === app.id
                            }
                            className={`px-4 py-2 rounded-md text-sm font-medium border ${
                              app.status === "accepted"
                                ? "bg-green-100 text-green-800 border-green-300 opacity-50 cursor-not-allowed"
                                : "bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
                            }`}
                          >
                            Accept
                          </button>

                          <button
                            onClick={() =>
                              handleStatusUpdate(app.id, "rejected")
                            }
                            disabled={
                              app.status === "rejected" ||
                              updatingStatus === app.id
                            }
                            className={`px-4 py-2 rounded-md text-sm font-medium border ${
                              app.status === "rejected"
                                ? "bg-red-100 text-red-800 border-red-300 opacity-50 cursor-not-allowed"
                                : "bg-red-100 text-red-800 border-red-300 hover:bg-red-200"
                            }`}
                          >
                            Reject
                          </button>

                          <div className="relative">
                            <button
                              onClick={() => {
                                const today = new Date();
                                const nextWeek = new Date(
                                  today.setDate(today.getDate() + 7)
                                );
                                const formattedDate = nextWeek
                                  .toISOString()
                                  .split("T")[0];

                                handleStatusUpdate(
                                  app.id,
                                  "interview",
                                  formattedDate
                                );
                              }}
                              disabled={
                                app.status === "interview" ||
                                updatingStatus === app.id
                              }
                              className={`px-4 py-2 rounded-md text-sm font-medium border ${
                                app.status === "interview"
                                  ? "bg-blue-100 text-blue-800 border-blue-300 opacity-50 cursor-not-allowed"
                                  : "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200"
                              }`}
                            >
                              Schedule Interview
                            </button>
                          </div>
                        </div>

                        {updatingStatus === app.id && (
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <svg
                              className="animate-spin h-4 w-4 mr-2 text-indigo-600"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Updating status...
                          </div>
                        )}
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
