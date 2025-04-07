"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getJobDetails } from "@/services/job.api";
import JobApplicationForm from "@/components/applications/JobApplicationForm";
import LoadingIndicator from "@/components/ui/Loading";
import ProtectedRoute from "@/components/ProtectedRoute";
import Toast, { ToastType } from "@/components/ui/toast.alert";
import DashboardLayout from "@/components/laoyout/DashboardLayout";

const ApplyPage = () => {
  const { jobId } = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const [jobTitle, setJobTitle] = useState("");

  useEffect(() => {
    if (jobId && token) {
      fetchJobDetails();
    }
  }, [jobId, token]);

  const fetchJobDetails = async () => {
    try {
      const jobData = await getJobDetails(jobId as string, token);
      setJobTitle(jobData.title);
    } catch (error) {
      console.error("Failed to fetch job details:", error);
      router.push("/jobs");
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <JobApplicationForm
            jobId={Array.isArray(jobId) ? jobId[0] : jobId || ""}
            jobTitle={jobTitle}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default ApplyPage;
