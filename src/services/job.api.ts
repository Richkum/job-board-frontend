"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Define nested types for better type checking
interface SalaryRange {
  min: number;
  max: number;
}

interface Salary {
  range: SalaryRange;
  currency: "USD" | "EUR" | "GBP" | "FCFA";
  period: "hourly" | "monthly" | "yearly";
  isNegotiable: boolean;
}

interface Location {
  type: "remote" | "on-site" | "hybrid";
  country?: string;
  city?: string;
  address?: string;
}

// Define the complete CreateJobData type
interface CreateJobData {
  title: string;
  subtitle: string;
  jobType: "full-time" | "part-time" | "contract" | "freelance" | "internship";
  category:
    | "programming"
    | "design"
    | "marketing"
    | "sales"
    | "customer-service"
    | "general-labor"
    | "administrative"
    | "other";
  requirements: string[];
  technicalRequirements?: string[];
  description: string;
  salary: Salary;
  location: Location;
  applicationDeadline: Date | string;
  experienceLevel: "entry" | "junior" | "mid" | "senior" | "lead" | "any";
  benefits?: string[];
  [key: string]: any; // Allow additional fields
}

interface JobStats {
  total: number;
  open: number;
  closed: number;
  draft: number;
  archived: number;
  totalViews: number;
  totalApplications: number;
}

interface RecentActivity {
  _id: string;
  title: string;
  status: "open" | "closed" | "draft" | "archived";
  views: number;
  applicationCount: number;
  createdAt: string;
  updatedAt: string;
}

// Add these to your existing types

export enum JobSortBy {
  NEWEST = "newest",
  SALARY_HIGH = "salary_high",
  SALARY_LOW = "salary_low",
  MOST_VIEWED = "most_viewed",
  DEADLINE_CLOSEST = "deadline_closest",
}

export interface SearchJobsFilters {
  search?: string;
  categories?: string[];
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: "USD" | "EUR" | "GBP" | "FCFA";
  salaryPeriod?: "hourly" | "monthly" | "yearly";
  locationType?: "remote" | "on-site" | "hybrid";
  country?: string;
  city?: string;
  experienceLevels?: ("entry" | "junior" | "mid" | "senior" | "lead" | "any")[];
  jobTypes?: (
    | "full-time"
    | "part-time"
    | "contract"
    | "freelance"
    | "internship"
  )[];
  postedAfter?: Date;
  postedBefore?: Date;
  benefits?: string[];
  page?: number;
  limit?: number;
  sortBy?: JobSortBy;
  includeCompanyInfo?: boolean;
}

export interface SearchJobsResponse {
  jobs: CreateJobData[];
  total: number;
  pages: number;
}

// Interface for pagination response
interface PaginatedResponse<T> {
  jobs: T[];
  total: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

const flattenObject = (obj: any) => {
  const flatData: Record<string, any> = {};

  // Handle salary-related fields
  if (obj.salary) {
    if (obj.salary.range) {
      flatData.salaryMin = obj.salary.range.min;
      flatData.salaryMax = obj.salary.range.max;
    }
    flatData.salaryCurrency = obj.salary.currency;
    flatData.salaryPeriod = obj.salary.period;
    flatData.salaryNegotiable = obj.salary.isNegotiable;
  }

  // Handle location-related fields
  if (obj.location) {
    flatData.locationType = obj.location.type;
    flatData.locationCountry = obj.location.country;
    flatData.locationCity = obj.location.city;
    flatData.locationAddress = obj.location.address;
  }

  // Handle all other fields
  Object.entries(obj).forEach(([key, value]) => {
    if (key !== "salary" && key !== "location") {
      flatData[key] = value;
    }
  });

  return flatData;
};

export const createJob = async (
  data: CreateJobData,
  poster: File | null,
  token: string
): Promise<any> => {
  try {
    console.log("Frontend - Original data:", data);

    // Flatten nested objects
    const flattenedData = flattenObject(data);
    console.log("Frontend - Flattened data:", flattenedData);

    // Create multipart form data
    const formData = new FormData();

    // Add poster if provided
    if (poster) {
      formData.append("poster", poster);
    }

    // Add each field to FormData
    Object.entries(flattenedData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    // Log the FormData (for debugging)
    console.log("Frontend - FormData entries:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const response = await fetch(`${API_URL}/jobs`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create job");
    }

    return response.json();
  } catch (error) {
    console.error("Frontend - Create job error:", error);
    throw error;
  }
};

export const getEmployerJobs = async (
  token: string
): Promise<CreateJobData[]> => {
  try {
    const response = await fetch(`${API_URL}/jobs/employer`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch jobs");
    }

    return response.json();
  } catch (error) {
    console.error("Frontend - Fetch employer jobs error:", error);
    throw error;
  }
};

export const getEmployerJobStats = async (token: string): Promise<JobStats> => {
  try {
    const response = await fetch(`${API_URL}/jobs/employer/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch job stats");
    }

    return response.json();
  } catch (error) {
    console.error("Frontend - Fetch job stats error:", error);
    throw error;
  }
};

export const getRecentJobsActivity = async (
  token: string
): Promise<RecentActivity[]> => {
  try {
    const response = await fetch(`${API_URL}/jobs/employer/recent-activity`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch recent activity");
    }

    return response.json();
  } catch (error) {
    console.error("Frontend - Fetch recent activity error:", error);
    throw error;
  }
};

export const updateJobStatus = async (
  jobId: string,
  status: "open" | "closed" | "draft" | "archived",
  token: string
): Promise<CreateJobData> => {
  try {
    const response = await fetch(`${API_URL}/jobs/${jobId}/status`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update job status");
    }

    return response.json();
  } catch (error) {
    console.error("Frontend - Update job status error:", error);
    throw error;
  }
};

export const duplicateJob = async (
  jobId: string,
  token: string
): Promise<CreateJobData> => {
  try {
    const response = await fetch(`${API_URL}/jobs/${jobId}/duplicate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to duplicate job");
    }

    return response.json();
  } catch (error) {
    console.error("Frontend - Duplicate job error:", error);
    throw error;
  }
};

// Get active jobs (for initial listing)
export const getActiveJobs = async (
  page: number = 1,
  limit: number = 10,
  token: string
): Promise<PaginatedResponse<CreateJobData>> => {
  try {
    const response = await fetch(
      `${API_URL}/jobs?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch active jobs");
    }

    return response.json();
  } catch (error) {
    console.error("Frontend - Fetch active jobs error:", error);
    throw error;
  }
};

// Search and filter jobs
export const searchJobs = async (
  params: {
    search?: string;
    jobTypes?: string[];
    categories?: string[];
    locationTypes?: string[];
    country?: string;
    city?: string;
    experienceLevels?: string[];
    salaryMin?: number;
    salaryMax?: number;
    salaryCurrency?: string;
    salaryPeriod?: string;
    page?: number;
    limit?: number;
  },
  token: string
): Promise<PaginatedResponse<CreateJobData>> => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // For array values like jobTypes, add each item separately
          value.forEach((item) => {
            if (item !== null && item !== undefined) {
              queryParams.append(key, item);
            }
          });
        } else {
          // For non-array values, add them directly
          queryParams.append(key, value.toString());
        }
      }
    });

    const response = await fetch(
      `${API_URL}/jobs/search?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to search jobs");
    }

    return response.json();
  } catch (error) {
    console.error("Frontend - Search jobs error:", error);
    throw error;
  }
};

// Get job details
export const getJobDetails = async (
  jobId: string,
  token: string
): Promise<CreateJobData> => {
  try {
    const response = await fetch(`${API_URL}/jobs/${jobId}/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch job details");
    }

    return response.json();
  } catch (error) {
    console.error("Frontend - Fetch job details error:", error);
    throw error;
  }
};

// Helper function to increment job views
export const incrementJobViews = async (
  jobId: string,
  token: string
): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/jobs/${jobId}/view`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to increment job views");
    }
  } catch (error) {
    console.error("Frontend - Increment job views error:", error);
    // Silently fail as this is not critical
  }
};
