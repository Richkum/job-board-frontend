// Create a separate types file for consistency
export interface JobCompany {
  name?: string;
  logo?: string;
}

export interface JobLocation {
  type: "remote" | "on-site" | "hybrid";
  city?: string;
  country?: string;
  address?: string;
}

export interface JobSalary {
  range?: {
    min: number;
    max: number;
  };
  currency: "USD" | "EUR" | "GBP" | "FCFA";
  period: "hourly" | "monthly" | "yearly";
  isNegotiable: boolean;
}

export interface Job {
  _id: string;
  title: string;
  subtitle?: string;
  company?: JobCompany;
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
  location: JobLocation;
  experienceLevel: "entry" | "junior" | "mid" | "senior" | "lead" | "any";
  applicationDeadline: string;
  salary?: JobSalary;
  technicalRequirements?: string[];
  requirements?: string[];
  description?: string;
  benefits?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type JobFilterType = {
  jobTypes?: (
    | "full-time"
    | "part-time"
    | "contract"
    | "freelance"
    | "internship"
  )[];
  categories?: (
    | "programming"
    | "design"
    | "marketing"
    | "sales"
    | "customer-service"
    | "general-labor"
    | "administrative"
    | "other"
  )[];
  experienceLevels?: ("entry" | "junior" | "mid" | "senior" | "lead" | "any")[];
  locationTypes?: ("remote" | "on-site" | "hybrid")[];
  salaryRange?: {
    min?: number;
    max?: number;
    currency?: "USD" | "EUR" | "GBP" | "FCFA";
    period?: "hourly" | "monthly" | "yearly";
  };
};
