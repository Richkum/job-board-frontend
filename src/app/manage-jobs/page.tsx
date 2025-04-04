"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/laoyout/DashboardLayout";
import LoadingIndicator from "@/components/ui/Loading";
import Toast from "@/components/ui/toast.alert";
import { useAuth } from "@/context/AuthContext";
import {
  getEmployerJobs,
  getEmployerJobStats,
  getRecentJobsActivity,
  updateJobStatus,
  duplicateJob,
} from "@/services/job.api";
import {
  Clock,
  Copy,
  Eye,
  FileText,
  MoreVertical,
  Users,
  AlertCircle,
  CheckCircle2,
  Archive,
  PencilLine,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

type ToastState = {
  show: boolean;
  message: string;
  type: "success" | "error" | "warning" | "info";
};

export default function ManageJobPage() {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "info",
  });
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [jobsData, statsData, activityData] = await Promise.all([
          getEmployerJobs(token!),
          getEmployerJobStats(token!),
          getRecentJobsActivity(token!),
        ]);
        setJobs(jobsData);
        setStats(statsData);
        setRecentActivity(activityData);
      } catch (error: any) {
        setToast({
          show: true,
          message: error.message || "Failed to fetch data",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleStatusUpdate = async (jobId: string, newStatus: string) => {
    setIsLoading(true);
    try {
      await updateJobStatus(jobId, newStatus as any, token!);
      // Refresh jobs list
      const updatedJobs = await getEmployerJobs(token!);
      setJobs(updatedJobs);
      setToast({
        show: true,
        message: "Job status updated successfully",
        type: "success",
      });
    } catch (error: any) {
      setToast({
        show: true,
        message: error.message || "Failed to update status",
        type: "error",
      });
    } finally {
      setIsLoading(false);
      setActiveDropdown(null);
    }
  };

  const handleDuplicate = async (jobId: string) => {
    setIsLoading(true);
    try {
      await duplicateJob(jobId, token!);
      // Refresh jobs list
      const updatedJobs = await getEmployerJobs(token!);
      setJobs(updatedJobs);
      setToast({
        show: true,
        message: "Job duplicated successfully",
        type: "success",
      });
    } catch (error: any) {
      setToast({
        show: true,
        message: error.message || "Failed to duplicate job",
        type: "error",
      });
    } finally {
      setIsLoading(false);
      setActiveDropdown(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-success/10 text-success";
      case "closed":
        return "bg-danger/10 text-danger";
      case "draft":
        return "bg-warning/10 text-warning";
      case "archived":
        return "bg-info/10 text-info";
      default:
        return "bg-info/10 text-info";
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    setIsLoading(true);
    try {
      await updateJobStatus(jobId, newStatus as any, token!);
      const updatedJobs = await getEmployerJobs(token!);
      setJobs(updatedJobs);
      setToast({
        show: true,
        message: "Job status updated successfully",
        type: "success",
      });
    } catch (error: any) {
      setToast({
        show: true,
        message: error.message || "Failed to update status",
        type: "error",
      });
    } finally {
      setIsLoading(false);
      setActiveDropdown(null);
    }
  };

  const JobImage = ({ poster, title }: { poster?: string; title: string }) => (
    <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-bgSecondary dark:bg-bgSecondary-dark">
      {poster ? (
        <img src={poster} alt={title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-primary/10">
          <FileText className="w-6 h-6 text-primary" />
        </div>
      )}
    </div>
  );

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {isLoading && <LoadingIndicator />}

        {toast.show && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats &&
              [
                {
                  label: "Total Jobs",
                  value: stats.total,
                  icon: FileText,
                  color: "text-primary",
                },
                {
                  label: "Active Jobs",
                  value: stats.open,
                  icon: CheckCircle2,
                  color: "text-success",
                },
                {
                  label: "Total Views",
                  value: stats.totalViews,
                  icon: Eye,
                  color: "text-accent",
                },
                {
                  label: "Total Applications",
                  value: stats.totalApplications,
                  icon: Users,
                  color: "text-secondary",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-bgCard dark:bg-bgCard-dark p-6 rounded-lg shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-textSecondary dark:text-textSecondary-dark text-sm">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-semibold mt-1">
                        {stat.value}
                      </p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </div>
              ))}
          </div>

          {/* Jobs Section - Improved styling */}
          <div className="bg-bgCard dark:bg-bgCard-dark rounded-lg shadow-sm mb-8">
            <div className="p-6 border-b border-border dark:border-border-dark">
              <h2 className="text-xl font-semibold">Your Jobs</h2>
            </div>
            <div className="divide-y divide-border  dark:divide-border-dark">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="p-6 hover:bg-bgSecondary/50 dark:hover:bg-bgSecondary-dark/50"
                >
                  <div className="flex items-start space-x-4">
                    <JobImage poster={job.poster} title={job.title} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium truncate">
                          {job.title}
                        </h3>
                        <div className="flex items-center space-x-4">
                          <select
                            value={job.status}
                            onChange={(e) =>
                              handleStatusChange(job._id, e.target.value)
                            }
                            className={`text-sm rounded-full px-3 py-1 border-none ${getStatusColor(
                              job.status
                            )}`}
                          >
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                          </select>
                          <div className="relative">
                            <button
                              onClick={() =>
                                setActiveDropdown(
                                  activeDropdown === job._id ? null : job._id
                                )
                              }
                              className="p-2 hover:bg-bgSecondary dark:hover:bg-bgSecondary-dark rounded-full"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>
                            {activeDropdown === job._id && (
                              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-bgCard dark:bg-bgCard-dark ring-1 ring-black ring-opacity-5 z-10">
                                <div className="py-1">
                                  <Link
                                    href={`/jobs/${job._id}`}
                                    className="flex items-center px-4 py-2 text-sm hover:bg-bgSecondary dark:hover:bg-bgSecondary-dark"
                                  >
                                    <Eye className="w-4 h-4 mr-3" />
                                    View Job
                                  </Link>
                                  <Link
                                    href={`/jobs/${job._id}/applications`}
                                    className="flex items-center px-4 py-2 text-sm hover:bg-bgSecondary dark:hover:bg-bgSecondary-dark"
                                  >
                                    <Users className="w-4 h-4 mr-3" />
                                    View Applications
                                  </Link>
                                  <Link
                                    href={`/jobs/${job._id}/edit`}
                                    className="flex items-center px-4 py-2 text-sm hover:bg-bgSecondary dark:hover:bg-bgSecondary-dark"
                                  >
                                    <PencilLine className="w-4 h-4 mr-3" />
                                    Edit Job
                                  </Link>
                                  <button
                                    onClick={() => handleDuplicate(job._id)}
                                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-bgSecondary dark:hover:bg-bgSecondary-dark"
                                  >
                                    <Copy className="w-4 h-4 mr-3" />
                                    Duplicate Job
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-textSecondary dark:text-textSecondary-dark">
                        {job.subtitle}
                      </p>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-textSecondary dark:text-textSecondary-dark">
                        <span>
                          <Eye className="w-4 h-4 inline mr-1" /> {job.views}{" "}
                          views
                        </span>
                        <span>
                          <Users className="w-4 h-4 inline mr-1" />{" "}
                          {job.applicationCount} applications
                        </span>
                        <span>
                          <Clock className="w-4 h-4 inline mr-1" />{" "}
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-bgCard dark:bg-bgCard-dark rounded-lg shadow-sm">
            <div className="p-6 border-b border-border dark:border-border-dark">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {recentActivity.map((activity) => (
                  <div
                    key={activity._id}
                    className="flex items-start space-x-4"
                  >
                    <div className="flex-shrink-0">
                      <Clock className="w-5 h-5 text-textSecondary dark:text-textSecondary-dark" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-sm text-textSecondary dark:text-textSecondary-dark">
                        Status changed to {activity.status} • {activity.views}{" "}
                        views • {activity.applicationCount} applications
                      </p>
                      <p className="text-xs text-textMuted dark:text-textMuted-dark mt-1">
                        {new Date(activity.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
