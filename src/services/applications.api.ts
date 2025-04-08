"use client";
import {
  CreateApplicationDto,
  PaginatedApplicationsResponseDto,
  ApplicationResponseDto,
  UpdateApplicationStatusDto,
  WithdrawApplicationDto,
} from "@/types/application";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Job Seekers API Calls

/**
 * Create a new application
 * @param applicationData - The application data to be submitted
 * @param token - The user's authentication token
 */
export const createApplication = async (
  applicationData: CreateApplicationDto,
  token: string
): Promise<void> => {
  const response = await fetch(`${API_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(applicationData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to submit application");
  }
};

/**
 * Get the applications submitted by the job seeker
 * @param token - The user's authentication token
 */
export const getMyApplications = async (
  token: string
): Promise<PaginatedApplicationsResponseDto> => {
  const response = await fetch(`${API_URL}/applications/my-applications`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch applications");
  }

  return response.json();
};

/**
 * Withdraw an application
 * @param applicationId - The ID of the application to withdraw
 * @param withdrawDto - The withdrawal reason
 * @param token - The user's authentication token
 */
export const withdrawApplication = async (
  applicationId: string,
  withdrawDto: WithdrawApplicationDto,
  token: string
): Promise<ApplicationResponseDto> => {
  const response = await fetch(
    `${API_URL}/applications/${applicationId}/withdraw`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(withdrawDto),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to withdraw application");
  }

  return response.json();
};

// Employers API Calls

/**
 * Get all applications for the employer's jobs
 * @param token - The employer's authentication token
 */
export const getAllJobsApplications = async (
  token: string
): Promise<PaginatedApplicationsResponseDto> => {
  const response = await fetch(`${API_URL}/applications/my-jobs/applications`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch applications");
  }

  return response.json();
};

/**
 * Get applications for a specific job
 * @param jobId - The ID of the job
 * @param token - The employer's authentication token
 */
export const getJobApplications = async (
  jobId: string,
  token: string
): Promise<PaginatedApplicationsResponseDto> => {
  const response = await fetch(`${API_URL}/applications/job/${jobId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch applications");
  }

  return response.json();
};

/**
 * Update the status of an application
 * @param applicationId - The ID of the application
 * @param updateStatusDto - The new status data
 * @param token - The employer's authentication token
 */
export const updateApplicationStatus = async (
  applicationId: string,
  updateStatusDto: UpdateApplicationStatusDto,
  token: string
): Promise<ApplicationResponseDto> => {
  const response = await fetch(
    `${API_URL}/applications/${applicationId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateStatusDto),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update application status");
  }

  return response.json();
};
