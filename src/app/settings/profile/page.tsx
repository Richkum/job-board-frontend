"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Toast from "@/components/ui/toast.alert";
import LoadingIndicator from "@/components/ui/Loading";
import Image from "next/image";
import {
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaGlobe,
  FaEdit,
  FaCheck,
  FaTimes,
  FaPlus,
} from "react-icons/fa";

// Define types for our profile data
interface SocialLinks {
  linkedin: string;
  twitter: string;
  github: string;
}

interface Location {
  country: string;
  city: string;
  coordinates?: number[];
}

interface CompanyDetails {
  companyName: string;
  website: string;
  about: string;
  companyLogo: string;
}

interface UserProfile {
  bio: string;
  technologies: string[];
  socials: SocialLinks;
  location: Location;
  companyDetails: CompanyDetails;
}

interface ProfileData {
  _id: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
  profilePicture: string;
  profile: UserProfile;
  createdAt: string;
  updatedAt: string;
}

// Form data type for updating profile
interface UpdateProfileForm {
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
  };
  companyDetails: {
    companyName: string;
    website: string;
    about: string;
  };
}

// Define more specific type for user
interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, isAuthenticated, loading: authLoading } = useAuth();

  // Debug the auth state in console
  useEffect(() => {
    console.log("Auth state in profile page:", {
      user,
      token: token ? `${token.substring(0, 15)}...` : null,
      isAuthenticated,
    });
  }, [user, token, isAuthenticated]);

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("basicInfo");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      console.log("User not authenticated, redirecting to login page");
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Form state
  const [formData, setFormData] = useState<UpdateProfileForm>({
    bio: "",
    technologies: [],
    socials: {
      linkedin: "",
      twitter: "",
      github: "",
    },
    location: {
      country: "",
      city: "",
    },
    companyDetails: {
      companyName: "",
      website: "",
      about: "",
    },
  });

  // New technology input
  const [newTech, setNewTech] = useState<string>("");

  // Fetch user profile data
  useEffect(() => {
    // Only fetch if we have authentication
    if (authLoading || !isAuthenticated || !token || !user) {
      console.log("Not ready to fetch profile:", {
        authLoading,
        isAuthenticated,
        hasToken: !!token,
        hasUser: !!user,
      });
      return;
    }

    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        console.log("Fetching profile data from API");

        const response = await fetch(
          `http://localhost:5000/api/users/profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Profile API response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            "Profile API error:",
            response.status,
            response.statusText
          );
          console.error("Error response:", errorText);
          throw new Error(`Failed to fetch profile data: ${response.status}`);
        }

        const data = await response.json();
        console.log("Profile data received");

        setProfile(data);

        // Initialize form data with profile data
        setFormData({
          bio: data.profile?.bio || "",
          technologies: data.profile?.technologies || [],
          socials: {
            linkedin: data.profile?.socials?.linkedin || "",
            twitter: data.profile?.socials?.twitter || "",
            github: data.profile?.socials?.github || "",
          },
          location: {
            country: data.profile?.location?.country || "",
            city: data.profile?.location?.city || "",
          },
          companyDetails: {
            companyName: data.profile?.companyDetails?.companyName || "",
            website: data.profile?.companyDetails?.website || "",
            about: data.profile?.companyDetails?.about || "",
          },
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [authLoading, isAuthenticated, token, user]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Handle nested objects
    if (name.includes(".")) {
      const [parentKey, childKey] = name.split(".");

      // Type-safe approach for nested objects
      const newFormData = { ...formData };

      if (parentKey === "socials") {
        newFormData.socials = {
          ...newFormData.socials,
          [childKey]: value,
        };
      } else if (parentKey === "location") {
        newFormData.location = {
          ...newFormData.location,
          [childKey]: value,
        };
      } else if (parentKey === "companyDetails") {
        newFormData.companyDetails = {
          ...newFormData.companyDetails,
          [childKey]: value,
        };
      }

      setFormData(newFormData);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle profile picture change
  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Add new technology
  const handleAddTechnology = () => {
    if (newTech.trim() === "") return;

    if (!formData.technologies.includes(newTech.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, newTech.trim()],
      });
    }

    setNewTech("");
  };

  // Remove technology
  const handleRemoveTechnology = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((t) => t !== tech),
    });
  };

  // Handle save profile
  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    setPageLoading(true);
    setError(null);

    try {
      if (!user || !user.id || !token) {
        throw new Error("User information not available");
      }

      console.log("Updating profile for user ID:", user.id);

      const formDataObj = new FormData();

      // Add profile data as JSON
      formDataObj.append("bio", formData.bio);

      // Add technologies as array
      if (formData.technologies.length > 0) {
        formData.technologies.forEach((tech, index) => {
          formDataObj.append(`technologies[${index}]`, tech);
        });
      } else {
        // Send empty array if no technologies
        formDataObj.append("technologies", "");
      }

      // Add nested objects
      formDataObj.append("socials[linkedin]", formData.socials.linkedin || "");
      formDataObj.append("socials[twitter]", formData.socials.twitter || "");
      formDataObj.append("socials[github]", formData.socials.github || "");

      formDataObj.append("location[country]", formData.location.country || "");
      formDataObj.append("location[city]", formData.location.city || "");

      formDataObj.append(
        "companyDetails[companyName]",
        formData.companyDetails.companyName || ""
      );
      formDataObj.append(
        "companyDetails[website]",
        formData.companyDetails.website || ""
      );
      formDataObj.append(
        "companyDetails[about]",
        formData.companyDetails.about || ""
      );

      // Add profile picture if selected
      if (fileInputRef.current?.files?.[0]) {
        formDataObj.append("profilePicture", fileInputRef.current.files[0]);
      }

      console.log("Sending profile update request with form data");

      const response = await fetch(
        `http://localhost:5000/api/users/${user.id}/profile`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type with FormData - the browser will set it with the boundary
          },
          body: formDataObj,
        }
      );

      if (!response.ok) {
        console.error(
          "Profile update failed:",
          response.status,
          response.statusText
        );
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Failed to update profile: ${response.status}`);
      }

      const updatedProfile = await response.json();
      console.log("Profile updated successfully");

      setProfile(updatedProfile);
      setIsEditing(false);
      setSuccess("Profile updated successfully!");

      // Clear preview image after successful update
      setPreviewImage(null);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(
        `Failed to update profile: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setPageLoading(false);
    }
  };

  // Auth loading state
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-xl text-textSecondary">
            Please log in to view your profile
          </p>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Profile loading state
  if (loading && !profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  // Profile not found
  if (!profile) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-danger">Profile Not Found</h1>
          <p className="text-textSecondary">Unable to load profile data.</p>
          <div className="mt-4 space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 bg-bgSecondary dark:bg-bgSecondary-dark text-text dark:text-text-dark rounded-md hover:bg-bgSecondary-dark dark:hover:bg-bgSecondary transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Toast notifications */}
      {error && (
        <Toast type="error" message={error} onClose={() => setError(null)} />
      )}
      {success && (
        <Toast
          type="success"
          message={success}
          onClose={() => setSuccess(null)}
        />
      )}

      {pageLoading && <LoadingIndicator />}

      <div className="max-w-4xl mx-auto bg-bgCard dark:bg-bgCard-dark rounded-lg shadow-lg overflow-hidden transition-colors duration-200">
        {/* Profile Header */}
        <div className="relative bg-gradient-to-r from-primary to-accent p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white bg-bgCard dark:bg-bgCard-dark">
                {previewImage || profile.profilePicture ? (
                  <Image
                    src={previewImage || profile.profilePicture}
                    alt={profile.username}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                    onError={() => {
                      // If image fails to load, show fallback
                      console.error("Profile image failed to load");
                    }}
                    unoptimized={previewImage ? true : false} // Don't optimize local previews
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary-light dark:bg-primary-dark">
                    <span className="text-4xl font-bold text-primary">
                      {profile.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                {isEditing && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FaEdit className="text-white text-2xl" />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleProfilePictureChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="text-center sm:text-left text-white">
              <h1 className="text-3xl font-bold">{profile.username}</h1>
              <p className="text-lg opacity-90">{profile.email}</p>
              <div className="mt-2 text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full inline-block">
                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
              </div>
            </div>
          </div>

          {/* Edit/Save Profile Button */}
          <div className="absolute top-4 right-4">
            {isEditing ? (
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center space-x-1 bg-success hover:bg-success/80 text-white px-3 py-1 rounded-md transition-colors"
                >
                  <FaCheck />
                  <span>Save</span>
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center space-x-1 bg-danger hover:bg-danger/80 text-white px-3 py-1 rounded-md transition-colors"
                >
                  <FaTimes />
                  <span>Cancel</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-1 bg-white hover:bg-opacity-80 text-primary px-3 py-1 rounded-md transition-colors"
              >
                <FaEdit />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-border dark:border-border-dark">
          <nav className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab("basicInfo")}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${
                activeTab === "basicInfo"
                  ? "border-b-2 border-primary text-primary dark:text-primary"
                  : "text-textSecondary hover:text-text dark:hover:text-text-dark"
              }`}
            >
              Basic Info
            </button>
            <button
              onClick={() => setActiveTab("skills")}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${
                activeTab === "skills"
                  ? "border-b-2 border-primary text-primary dark:text-primary"
                  : "text-textSecondary hover:text-text dark:hover:text-text-dark"
              }`}
            >
              Skills & Technologies
            </button>
            <button
              onClick={() => setActiveTab("social")}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${
                activeTab === "social"
                  ? "border-b-2 border-primary text-primary dark:text-primary"
                  : "text-textSecondary hover:text-text dark:hover:text-text-dark"
              }`}
            >
              Social Profiles
            </button>
            {profile.role === "employer" && (
              <button
                onClick={() => setActiveTab("company")}
                className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${
                  activeTab === "company"
                    ? "border-b-2 border-primary text-primary dark:text-primary"
                    : "text-textSecondary hover:text-text dark:hover:text-text-dark"
                }`}
              >
                Company Details
              </button>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Basic Info Tab */}
          {activeTab === "basicInfo" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl font-bold text-text dark:text-text-dark mb-4">
                  About Me
                </h2>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark text-text dark:text-text-dark"
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-textSecondary dark:text-textSecondary-dark whitespace-pre-wrap">
                    {profile.profile?.bio || "No bio provided yet."}
                  </p>
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold text-text dark:text-text-dark mb-4">
                  Location
                </h2>
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        name="location.country"
                        value={formData.location.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark text-text dark:text-text-dark"
                        placeholder="Country"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="location.city"
                        value={formData.location.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark text-text dark:text-text-dark"
                        placeholder="City"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center text-textSecondary dark:text-textSecondary-dark">
                    {profile.profile?.location?.city ||
                    profile.profile?.location?.country ? (
                      <p>
                        {[
                          profile.profile?.location?.city,
                          profile.profile?.location?.country,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    ) : (
                      <p>No location provided yet.</p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold text-text dark:text-text-dark mb-4">
                  Account Information
                </h2>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark w-32">
                      Username:
                    </span>
                    <span className="text-text dark:text-text-dark">
                      {profile.username}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark w-32">
                      Email:
                    </span>
                    <span className="text-text dark:text-text-dark">
                      {profile.email}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark w-32">
                      Role:
                    </span>
                    <span className="text-text dark:text-text-dark capitalize">
                      {profile.role}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark w-32">
                      Joined:
                    </span>
                    <span className="text-text dark:text-text-dark">
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === "skills" && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold text-text dark:text-text-dark mb-4">
                Skills & Technologies
              </h2>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      className="flex-grow px-3 py-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark text-text dark:text-text-dark"
                      placeholder="Add a technology..."
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAddTechnology()
                      }
                    />
                    <button
                      onClick={handleAddTechnology}
                      className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors"
                    >
                      <FaPlus className="text-sm" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.technologies.map((tech) => (
                      <div
                        key={tech}
                        className="flex items-center space-x-1 bg-primary-light dark:bg-primary-dark text-primary dark:text-white px-3 py-1 rounded-full text-sm"
                      >
                        <span>{tech}</span>
                        <button
                          onClick={() => handleRemoveTechnology(tech)}
                          className="text-primary hover:text-danger dark:text-white dark:hover:text-danger"
                        >
                          <FaTimes size={12} />
                        </button>
                      </div>
                    ))}

                    {formData.technologies.length === 0 && (
                      <p className="text-textMuted dark:text-textMuted-dark">
                        No technologies added yet. Add some!
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.profile?.technologies?.map((tech) => (
                    <span
                      key={tech}
                      className="bg-primary-light dark:bg-primary-dark text-primary dark:text-white px-3 py-1 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}

                  {(!profile.profile?.technologies ||
                    profile.profile.technologies.length === 0) && (
                    <p className="text-textMuted dark:text-textMuted-dark">
                      No technologies listed yet.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Social Profiles Tab */}
          {activeTab === "social" && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold text-text dark:text-text-dark mb-4">
                Social Profiles
              </h2>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1">
                      LinkedIn
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border dark:border-border-dark bg-bgSecondary dark:bg-bgSecondary-dark text-textMuted dark:text-textMuted-dark">
                        <FaGithub className="text-gray-800 dark:text-white" />
                      </span>
                      <input
                        type="text"
                        name="socials.github"
                        value={formData.socials.github}
                        onChange={handleInputChange}
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-border dark:border-border-dark bg-bg dark:bg-bg-dark text-text dark:text-text-dark"
                        placeholder="https://github.com/username"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {profile.profile?.socials?.linkedin ? (
                    <a
                      href={profile.profile.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-textSecondary dark:text-textSecondary-dark hover:text-primary transition-colors"
                    >
                      <FaLinkedin className="text-blue-600 text-xl" />
                      <span>{profile.profile.socials.linkedin}</span>
                    </a>
                  ) : null}

                  {profile.profile?.socials?.twitter ? (
                    <a
                      href={profile.profile.socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-textSecondary dark:text-textSecondary-dark hover:text-primary transition-colors"
                    >
                      <FaTwitter className="text-blue-400 text-xl" />
                      <span>{profile.profile.socials.twitter}</span>
                    </a>
                  ) : null}

                  {profile.profile?.socials?.github ? (
                    <a
                      href={profile.profile.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-textSecondary dark:text-textSecondary-dark hover:text-primary transition-colors"
                    >
                      <FaGithub className="text-gray-800 dark:text-white text-xl" />
                      <span>{profile.profile.socials.github}</span>
                    </a>
                  ) : null}

                  {!profile.profile?.socials?.linkedin &&
                    !profile.profile?.socials?.twitter &&
                    !profile.profile?.socials?.github && (
                      <p className="text-textMuted dark:text-textMuted-dark">
                        No social profiles added yet.
                      </p>
                    )}
                </div>
              )}
            </div>
          )}

          {/* Company Details Tab (for employers only) */}
          {activeTab === "company" && profile.role === "employer" && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold text-text dark:text-text-dark mb-4">
                Company Details
              </h2>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="companyDetails.companyName"
                      value={formData.companyDetails.companyName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark text-text dark:text-text-dark"
                      placeholder="Company Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1">
                      Website
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border dark:border-border-dark bg-bgSecondary dark:bg-bgSecondary-dark text-textMuted dark:text-textMuted-dark">
                        <FaGlobe />
                      </span>
                      <input
                        type="text"
                        name="companyDetails.website"
                        value={formData.companyDetails.website}
                        onChange={handleInputChange}
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-border dark:border-border-dark bg-bg dark:bg-bg-dark text-text dark:text-text-dark"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1">
                      About Company
                    </label>
                    <textarea
                      name="companyDetails.about"
                      value={formData.companyDetails.about}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark text-text dark:text-text-dark"
                      rows={4}
                      placeholder="Tell us about your company..."
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {profile.profile?.companyDetails?.companyName ? (
                    <div>
                      <h3 className="font-semibold text-lg text-text dark:text-text-dark">
                        {profile.profile.companyDetails.companyName}
                      </h3>

                      {profile.profile.companyDetails.website && (
                        <a
                          href={profile.profile.companyDetails.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary-dark transition-colors text-sm"
                        >
                          {profile.profile.companyDetails.website}
                        </a>
                      )}

                      {profile.profile.companyDetails.about && (
                        <p className="mt-3 text-textSecondary dark:text-textSecondary-dark whitespace-pre-wrap">
                          {profile.profile.companyDetails.about}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-textMuted dark:text-textMuted-dark">
                      No company details added yet.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// "use client";

// import type React from "react";

// import { useState, useEffect, useRef, type FormEvent } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";
// import Toast from "@/components/ui/toast.alert";
// import LoadingIndicator from "@/components/ui/Loading";
// import { useApiClient } from "@/components/api-client";

// // Define types for our profile data
// interface SocialLinks {
//   linkedin: string;
//   twitter: string;
//   github: string;
// }

// interface Location {
//   country: string;
//   city: string;
//   coordinates?: number[];
// }

// interface CompanyDetails {
//   companyName: string;
//   website: string;
//   about: string;
//   companyLogo: string;
// }

// interface UserProfile {
//   bio: string;
//   technologies: string[];
//   socials: SocialLinks;
//   location: Location;
//   companyDetails: CompanyDetails;
// }

// interface ProfileData {
//   _id: string;
//   username: string;
//   email: string;
//   role: string;
//   isVerified: boolean;
//   profilePicture: string;
//   profile: UserProfile;
//   createdAt: string;
//   updatedAt: string;
// }

// // Form data type for updating profile
// interface UpdateProfileForm {
//   bio: string;
//   technologies: string[];
//   socials: {
//     linkedin: string;
//     twitter: string;
//     github: string;
//   };
//   location: {
//     country: string;
//     city: string;
//   };
//   companyDetails: {
//     companyName: string;
//     website: string;
//     about: string;
//   };
// }

// export default function ProfilePage() {
//   const router = useRouter();
//   const { user, token, isAuthenticated, loading: authLoading } = useAuth();
//   const { fetchApi } = useApiClient();

//   // Debug the auth state in console
//   useEffect(() => {
//     console.log("Auth state in profile page:", {
//       user,
//       token: token ? `${token.substring(0, 15)}...` : null,
//       isAuthenticated,
//       authLoading,
//     });
//   }, [user, token, isAuthenticated, authLoading]);

//   const [profile, setProfile] = useState<ProfileData | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [pageLoading, setPageLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [isEditing, setIsEditing] = useState<boolean>(false);
//   const [activeTab, setActiveTab] = useState<string>("basicInfo");
//   const [previewImage, setPreviewImage] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Redirect if not authenticated
//   useEffect(() => {
//     if (!authLoading && !isAuthenticated) {
//       console.log("User not authenticated, redirecting to login page");
//       router.push("/login");
//     }
//   }, [authLoading, isAuthenticated, router]);

//   // Form state
//   const [formData, setFormData] = useState<UpdateProfileForm>({
//     bio: "",
//     technologies: [],
//     socials: {
//       linkedin: "",
//       twitter: "",
//       github: "",
//     },
//     location: {
//       country: "",
//       city: "",
//     },
//     companyDetails: {
//       companyName: "",
//       website: "",
//       about: "",
//     },
//   });

//   // New technology input
//   const [newTech, setNewTech] = useState<string>("");

//   // Fetch user profile data
//   useEffect(() => {
//     // Only fetch if we have authentication
//     if (authLoading || !isAuthenticated || !token || !user) {
//       console.log("Not ready to fetch profile:", {
//         authLoading,
//         isAuthenticated,
//         hasToken: !!token,
//         hasUser: !!user,
//       });
//       return;
//     }

//     const fetchUserProfile = async () => {
//       setLoading(true);
//       try {
//         console.log("Fetching profile data from API");

//         const response = await fetchApi("/users/profile", {
//           method: "GET",
//           requireAuth: true,
//         });

//         console.log("Profile API response status:", response.status);

//         if (!response.ok) {
//           const errorText = await response.text();
//           console.error(
//             "Profile API error:",
//             response.status,
//             response.statusText
//           );
//           console.error("Error response:", errorText);
//           throw new Error(`Failed to fetch profile data: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log("Profile data received");

//         setProfile(data);

//         // Initialize form data with profile data
//         setFormData({
//           bio: data.profile?.bio || "",
//           technologies: data.profile?.technologies || [],
//           socials: {
//             linkedin: data.profile?.socials?.linkedin || "",
//             twitter: data.profile?.socials?.twitter || "",
//             github: data.profile?.socials?.github || "",
//           },
//           location: {
//             country: data.profile?.location?.country || "",
//             city: data.profile?.location?.city || "",
//           },
//           companyDetails: {
//             companyName: data.profile?.companyDetails?.companyName || "",
//             website: data.profile?.companyDetails?.website || "",
//             about: data.profile?.companyDetails?.about || "",
//           },
//         });
//       } catch (err) {
//         console.error("Error fetching profile:", err);
//         setError("Failed to load profile. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserProfile();
//   }, [authLoading, isAuthenticated, token, user, fetchApi]);

//   // Handle form input changes
//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;

//     // Handle nested objects
//     if (name.includes(".")) {
//       const [parentKey, childKey] = name.split(".");

//       // Type-safe approach for nested objects
//       const newFormData = { ...formData };

//       if (parentKey === "socials") {
//         newFormData.socials = {
//           ...newFormData.socials,
//           [childKey]: value,
//         };
//       } else if (parentKey === "location") {
//         newFormData.location = {
//           ...newFormData.location,
//           [childKey]: value,
//         };
//       } else if (parentKey === "companyDetails") {
//         newFormData.companyDetails = {
//           ...newFormData.companyDetails,
//           [childKey]: value,
//         };
//       }

//       setFormData(newFormData);
//     } else {
//       setFormData({
//         ...formData,
//         [name]: value,
//       });
//     }
//   };

//   // Handle profile picture change
//   const handleProfilePictureChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Preview the image
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setPreviewImage(reader.result as string);
//     };
//     reader.readAsDataURL(file);
//   };

//   // Add new technology
//   const handleAddTechnology = () => {
//     if (newTech.trim() === "") return;

//     if (!formData.technologies.includes(newTech.trim())) {
//       setFormData({
//         ...formData,
//         technologies: [...formData.technologies, newTech.trim()],
//       });
//     }

//     setNewTech("");
//   };

//   // Remove technology
//   const handleRemoveTechnology = (tech: string) => {
//     setFormData({
//       ...formData,
//       technologies: formData.technologies.filter((t) => t !== tech),
//     });
//   };

//   // Handle save profile
//   const handleSaveProfile = async (e: FormEvent) => {
//     e.preventDefault();
//     setPageLoading(true);
//     setError(null);

//     try {
//       if (!user || !user.id || !token) {
//         throw new Error("User information not available");
//       }

//       console.log("Updating profile for user ID:", user.id);

//       const formDataObj = new FormData();

//       // Add profile data as JSON
//       formDataObj.append("bio", formData.bio);

//       // Add technologies as array
//       if (formData.technologies.length > 0) {
//         formData.technologies.forEach((tech, index) => {
//           formDataObj.append(`technologies[${index}]`, tech);
//         });
//       } else {
//         // Send empty array if no technologies
//         formDataObj.append("technologies", "");
//       }

//       // Add nested objects
//       formDataObj.append("socials[linkedin]", formData.socials.linkedin || "");
//       formDataObj.append("socials[twitter]", formData.socials.twitter || "");
//       formDataObj.append("socials[github]", formData.socials.github || "");

//       formDataObj.append("location[country]", formData.location.country || "");
//       formDataObj.append("location[city]", formData.location.city || "");

//       formDataObj.append(
//         "companyDetails[companyName]",
//         formData.companyDetails.companyName || ""
//       );
//       formDataObj.append(
//         "companyDetails[website]",
//         formData.companyDetails.website || ""
//       );
//       formDataObj.append(
//         "companyDetails[about]",
//         formData.companyDetails.about || ""
//       );

//       // Add profile picture if selected
//       if (fileInputRef.current?.files?.[0]) {
//         formDataObj.append("profilePicture", fileInputRef.current.files[0]);
//       }

//       console.log("Sending profile update request with form data");

//       const response = await fetchApi(`/users/${user.id}/profile`, {
//         method: "PATCH",
//         body: formDataObj,
//         // Don't set Content-Type with FormData - the browser will set it with the boundary
//       });

//       if (!response.ok) {
//         console.error(
//           "Profile update failed:",
//           response.status,
//           response.statusText
//         );
//         const errorText = await response.text();
//         console.error("Error response:", errorText);
//         throw new Error(`Failed to update profile: ${response.status}`);
//       }

//       const updatedProfile = await response.json();
//       console.log("Profile updated successfully");

//       setProfile(updatedProfile);
//       setIsEditing(false);
//       setSuccess("Profile updated successfully!");

//       // Clear preview image after successful update
//       setPreviewImage(null);

//       // Clear success message after 3 seconds
//       setTimeout(() => {
//         setSuccess(null);
//       }, 3000);
//     } catch (err) {
//       console.error("Error updating profile:", err);
//       setError(
//         `Failed to update profile: ${
//           err instanceof Error ? err.message : "Unknown error"
//         }`
//       );
//     } finally {
//       setPageLoading(false);
//     }
//   };

//   // Auth loading state
//   if (authLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <LoadingIndicator />
//       </div>
//     );
//   }

//   // Not authenticated
//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen flex justify-center items-center">
//         <div className="text-center">
//           <p className="text-xl text-textSecondary">
//             Please log in to view your profile
//           </p>
//           <button
//             onClick={() => router.push("/login")}
//             className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
//           >
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Rest of your component remains the same...
//   // (I've omitted the rest of the render code for brevity since it's not changing)

//   return (
//     <div className="min-h-screen bg-bg dark:bg-bg-dark py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
//       {/* Toast notifications */}
//       {error && (
//         <Toast type="error" message={error} onClose={() => setError(null)} />
//       )}
//       {success && (
//         <Toast
//           type="success"
//           message={success}
//           onClose={() => setSuccess(null)}
//         />
//       )}

//       {pageLoading && <LoadingIndicator />}

//       {/* The rest of your UI code remains the same */}
//       {/* ... */}
//     </div>
//   );
// }
