export type PortfolioLinkDto = {
  title: string;
  url: string;
  description?: string;
};

export type ExpectedSalaryDto = {
  amount: number;
  currency: "USD" | "EUR" | "GBP" | "FCFA";
  period: "hourly" | "monthly" | "yearly";
};

export type ResumeInfoDto = {
  format: "link" | "text" | "file";
  content: string;
  source?: "linkedin" | "github" | "drive" | "dropbox" | "other" | null;
  fileName?: string;
  mimeType?: string;
};

export type AdditionalMaterialDto = {
  title: string;
  type: "link" | "certificate" | "portfolio" | "project" | "other";
  url: string;
  description?: string;
};

export type ProfessionalProfilesDto = {
  linkedin?: string;
  github?: string;
  website?: string;
};

export type CreateApplicationDto = {
  jobId: string;
  coverLetter: string;
  resumeInfo: ResumeInfoDto;
  portfolio?: {
    links: PortfolioLinkDto[];
  };
  relevantExperience?: string[];
  expectedSalary?: ExpectedSalaryDto;
  additionalMaterials?: AdditionalMaterialDto[];
  professionalProfiles?: ProfessionalProfilesDto;
  notes?: string;
};

export type UpdateApplicationStatusDto = {
  status: "reviewing" | "accepted" | "rejected";
  reviewNotes?: string;
  interviewDate?: Date;
};

export type WithdrawApplicationDto = {
  withdrawalReason: string;
};

export type ApplicationResponseDto = {
  user: any;
  id: string;
  job: {
    id: string;
    title: string;
    company: string;
  };
  applicant: {
    id: string;
    name: string;
    email: string;
  };
  status: string;
  coverLetter: string;
  resumeInfo: ResumeInfoDto;
  portfolio?: {
    links: {
      title: string;
      url: string;
      description?: string;
    }[];
  };
  relevantExperience?: string[];
  expectedSalary?: {
    amount: number;
    currency: string;
    period: string;
  };
  additionalMaterials?: {
    title: string;
    type: "link" | "certificate" | "portfolio" | "project" | "other";
    url: string;
    description?: string;
  }[];
  professionalProfiles?: {
    linkedin?: string;
    github?: string;
    website?: string;
  };
  notes?: string;
  reviewNotes?: string;
  interviewDate?: Date;
  withdrawalReason?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PaginatedApplicationsResponseDto = {
  data: ApplicationResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type UpdateApplicationStatusResponseDto = ApplicationResponseDto;

export type WithdrawApplicationResponseDto = ApplicationResponseDto;
