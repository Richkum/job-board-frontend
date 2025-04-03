"use client";

import { UserProfile, UpdateProfileData } from "@/types/user";

// API base URL from environment or default
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * Fetch the current user's profile
 */
export const getUserProfile = async (token: string): Promise<UserProfile> => {
  const response = await fetch(`${API_URL}/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch profile");
  }

  return response.json();
};

/**
 * Fetch a specific user's profile by ID
 */
export const getUserProfileById = async (
  userId: string,
  token: string
): Promise<UserProfile> => {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  // console.error("user id :", userId, "token is:", token);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch profile");
  }

  return response.json();
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  userId: string,
  data: UpdateProfileData,
  profilePicture: File | null,
  token: string
): Promise<UserProfile> => {
  // Create FormData object
  const formData = new FormData();

  // Add profile picture if provided
  if (profilePicture) {
    formData.append("profilePicture", profilePicture);
  }

  // Convert the nested data structure to JSON string and append it
  const profileData = {
    bio: data.bio,
    technologies: data.technologies,
    socials: data.socials,
    location: data.location,
    companyDetails: data.companyDetails,
  };

  // Append the JSON string as 'data'
  formData.append("data", JSON.stringify(profileData));

  const response = await fetch(`${API_URL}/users/${userId}/profile`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      // Remove Content-Type header - let the browser set it with the boundary
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch((e) => ({ message: "Failed to parse error response" }));
    console.error("Update profile error:", error);
    throw new Error(error.message || "Failed to update profile");
  }

  return response.json();
};
