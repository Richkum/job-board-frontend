// Type for the user profile response
export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
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
      coordinates: number[];
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

// Base URL for API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetch the user profile from the API
 */
export const fetchUserProfile = async (token: string): Promise<UserProfile> => {
  const response = await fetch(`${API_BASE_URL}/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch profile: ${response.status}`);
  }

  return await response.json();
};

/**
 * Update the user profile
 */
export const updateUserProfile = async (
  userId: string,
  token: string,
  formData: FormData
): Promise<UserProfile> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to update profile: ${response.status}`);
  }

  return await response.json();
};
