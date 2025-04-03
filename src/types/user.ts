// User profile interface
export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  role: "jobSeeker" | "employer" | "admin";
  profilePicture: string;
  profile: {
    bio: string;
    technologies: string[];
    socials: {
      linkedin: string;
      twitter: string;
      github: string;
    };
    location: {
      country: string;
      city: string;
      coordinates: [number, number];
    };
    companyDetails: {
      companyName: string;
      website: string;
      about: string;
      companyLogo: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

// Interface for profile update data
export interface UpdateProfileData {
  bio?: string;
  technologies?: string[];
  socials?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  location?: {
    country?: string;
    city?: string;
    coordinates?: [number, number];
  };
  companyDetails?: {
    companyName?: string;
    website?: string;
    about?: string;
    companyLogo?: string;
  };
}

// User session interface
export interface UserSession {
  id: string;
  device: {
    name: string;
    os: string;
    browser: string;
    type: "mobile" | "desktop" | "tablet" | "bot";
  };
  ipAddress: string;
  location: {
    country: string;
    city: string;
    coordinates: [number, number];
  };
  lastActivity: string;
  isCurrent: boolean;
}
