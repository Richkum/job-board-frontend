"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingIndicator from "@/components/ui/Loading";
import {
  Camera,
  Pencil,
  Check,
  X,
  Github,
  Linkedin,
  Twitter,
  MapPin,
  Building2,
  User,
  Calendar,
} from "lucide-react";
import Toast from "@/components/ui/toast.alert";
import Image from "next/image";
import { UserProfile, UpdateProfileData } from "@/types/user";
import { getUserProfile, updateUserProfile } from "@/services/userService";
import DashboardLayout from "@/components/laoyout/DashboardLayout";

export default function ProfilePage() {
  const { isAuthenticated, isLoading, user, token } = useAuth();
  // console.error(
  //   "isAuthenticated",
  //   isAuthenticated,
  //   "user :",
  //   user,
  //   "token:",
  //   token
  // );

  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    show: boolean;
    type?: "success" | "error" | "warning" | "info";
    message: string;
  }>({ show: false, message: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState<UpdateProfileData>({
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

  // Tech input state
  const [techInput, setTechInput] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!isLoading && isAuthenticated && user) {
      fetchUserProfile();
    }
  }, [isLoading, isAuthenticated, user]);

  const fetchUserProfile = async () => {
    try {
      setProfileLoading(true);
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const data = await getUserProfile(token);

      setUserProfile(data);

      // Initialize form data with current profile data
      setFormData({
        bio: data.profile.bio || "",
        technologies: data.profile.technologies || [],
        socials: {
          linkedin: data.profile.socials?.linkedin || "",
          twitter: data.profile.socials?.twitter || "",
          github: data.profile.socials?.github || "",
        },
        location: {
          country: data.profile.location?.country || "",
          city: data.profile.location?.city || "",
        },
        companyDetails: {
          companyName: data.profile.companyDetails?.companyName || "",
          website: data.profile.companyDetails?.website || "",
          about: data.profile.companyDetails?.about || "",
        },
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      setToast({
        show: true,
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to load profile data",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleEditToggle = () => {
    setEditing(!editing);
    if (!editing) {
      // Reset form data to current profile values when entering edit mode
      if (userProfile) {
        setFormData({
          bio: userProfile.profile.bio || "",
          technologies: [...(userProfile.profile.technologies || [])],
          socials: {
            linkedin: userProfile.profile.socials?.linkedin || "",
            twitter: userProfile.profile.socials?.twitter || "",
            github: userProfile.profile.socials?.github || "",
          },
          location: {
            country: userProfile.profile.location?.country || "",
            city: userProfile.profile.location?.city || "",
          },
          companyDetails: {
            companyName: userProfile.profile.companyDetails?.companyName || "",
            website: userProfile.profile.companyDetails?.website || "",
            about: userProfile.profile.companyDetails?.about || "",
          },
        });
        setImagePreview(userProfile.profilePicture || null);
      }
    } else {
      // Clear image preview and selected file when canceling edit
      setImagePreview(userProfile?.profilePicture || null);
      setProfileImage(null);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Handle nested fields
    if (name.includes(".")) {
      const [section, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section as keyof UpdateProfileData],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddTech = () => {
    if (
      techInput.trim() &&
      !formData.technologies?.includes(techInput.trim())
    ) {
      setFormData({
        ...formData,
        technologies: [...(formData.technologies || []), techInput.trim()],
      });
      setTechInput("");
    }
  };

  const handleRemoveTech = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies?.filter((t) => t !== tech) || [],
    });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setProfileLoading(true);

      if (!token || !user?.id) {
        throw new Error("Authentication information missing");
      }

      // Update the profile using our service
      const updatedProfile = await updateUserProfile(
        user.id,
        formData,
        profileImage,
        token
      );

      // Update local state with the response
      setUserProfile(updatedProfile);

      // Exit edit mode
      setEditing(false);

      // Show success toast
      setToast({
        show: true,
        type: "success",
        message: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      setToast({
        show: true,
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to update profile",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  if (isLoading || profileLoading) {
    return <LoadingIndicator />;
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg dark:bg-bg-dark">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4"> {} Profile not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Unable to load your profile information.
          </p>
          <button
            onClick={() => fetchUserProfile()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="min-h-screen bg-bg dark:bg-bg-dark text-text dark:text-text-dark">
          {/* Toast notification */}
          {toast.show && (
            <Toast
              type={toast.type}
              message={toast.message}
              onClose={() => setToast({ show: false, message: "" })}
            />
          )}

          {/* Header */}
          <div className="w-full bg-bgCard dark:bg-bgCard-dark shadow-sm">
            <div className="container mx-auto px-4 py-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">My Profile</h1>
                <button
                  onClick={handleEditToggle}
                  className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                    editing
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      : "bg-primary text-white hover:bg-primary-dark"
                  } transition-colors`}
                >
                  {editing ? (
                    <>
                      <X size={18} /> Cancel
                    </>
                  ) : (
                    <>
                      <Pencil size={18} /> Edit Profile
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left column - Profile picture and basic info */}
              <div className="lg:col-span-1">
                <div className="bg-bgCard dark:bg-bgCard-dark rounded-lg shadow-md p-6">
                  {/* Profile picture */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative mb-4">
                      <div className="w-32 h-32 rounded-full overflow-hidden relative bg-gray-200 dark:bg-gray-700">
                        {imagePreview || userProfile.profilePicture ? (
                          <Image
                            src={imagePreview || userProfile.profilePicture}
                            alt={userProfile.username}
                            className="object-cover"
                            fill
                            sizes="128px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                            <User size={64} className="text-gray-400" />
                          </div>
                        )}
                      </div>

                      {editing && (
                        <button
                          onClick={triggerFileInput}
                          className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition-colors"
                          title="Change profile picture"
                        >
                          <Camera size={18} />
                        </button>
                      )}

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                        className="hidden"
                        accept="image/*"
                      />
                    </div>

                    <h2 className="text-xl font-semibold">
                      {userProfile.username}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {userProfile.email}
                    </p>
                    <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-dark">
                      {userProfile.role === "jobSeeker"
                        ? "Job Seeker"
                        : userProfile.role === "employer"
                        ? "Employer"
                        : "Admin"}
                    </div>
                    {/* Joined date */}
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                      <Calendar size={14} className="mr-1" />
                      Joined{" "}
                      {new Date(userProfile.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </div>
                  </div>

                  {/* Social links */}
                  <div className="space-y-4 mb-6">
                    <h3 className="font-medium text-lg">Social Links</h3>

                    {editing ? (
                      <div className="space-y-3">
                        <div>
                          <label
                            htmlFor="linkedin"
                            className="flex items-center gap-2 text-sm font-medium mb-1"
                          >
                            <Linkedin size={16} /> LinkedIn
                          </label>
                          <input
                            type="text"
                            id="linkedin"
                            name="socials.linkedin"
                            value={formData.socials?.linkedin || ""}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary dark:bg-bgSecondary-dark dark:text-text-dark dark:border-border-dark"
                            placeholder="LinkedIn profile URL"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="twitter"
                            className="flex items-center gap-2 text-sm font-medium mb-1"
                          >
                            <Twitter size={16} /> Twitter
                          </label>
                          <input
                            type="text"
                            id="twitter"
                            name="socials.twitter"
                            value={formData.socials?.twitter || ""}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary dark:bg-bgSecondary-dark dark:text-text-dark dark:border-border-dark"
                            placeholder="Twitter profile URL"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="github"
                            className="flex items-center gap-2 text-sm font-medium mb-1"
                          >
                            <Github size={16} /> GitHub
                          </label>
                          <input
                            type="text"
                            id="github"
                            name="socials.github"
                            value={formData.socials?.github || ""}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary dark:bg-bgSecondary-dark dark:text-text-dark dark:border-border-dark"
                            placeholder="GitHub profile URL"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {userProfile.profile.socials?.linkedin ? (
                          <a
                            href={userProfile.profile.socials.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary hover:underline"
                          >
                            <Linkedin size={18} /> LinkedIn
                          </a>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-400">
                            <Linkedin size={18} /> No LinkedIn profile
                          </div>
                        )}

                        {userProfile.profile.socials?.twitter ? (
                          <a
                            href={userProfile.profile.socials.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary hover:underline"
                          >
                            <Twitter size={18} /> Twitter
                          </a>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-400">
                            <Twitter size={18} /> No Twitter profile
                          </div>
                        )}

                        {userProfile.profile.socials?.github ? (
                          <a
                            href={userProfile.profile.socials.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary hover:underline"
                          >
                            <Github size={18} /> GitHub
                          </a>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-400">
                            <Github size={18} /> No GitHub profile
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Location */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Location</h3>

                    {editing ? (
                      <div className="space-y-3">
                        <div>
                          <label
                            htmlFor="country"
                            className="block text-sm font-medium mb-1"
                          >
                            Country
                          </label>
                          <input
                            type="text"
                            id="country"
                            name="location.country"
                            value={formData.location?.country || ""}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary dark:bg-bgSecondary-dark dark:text-text-dark dark:border-border-dark"
                            placeholder="Country"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="city"
                            className="block text-sm font-medium mb-1"
                          >
                            City
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="location.city"
                            value={formData.location?.city || ""}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary dark:bg-bgSecondary-dark dark:text-text-dark dark:border-border-dark"
                            placeholder="City"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        {userProfile.profile.location?.city ||
                        userProfile.profile.location?.country ? (
                          <div className="flex items-center gap-2">
                            <MapPin size={18} className="text-gray-500" />
                            <span>
                              {[
                                userProfile.profile.location?.city,
                                userProfile.profile.location?.country,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </span>
                          </div>
                        ) : (
                          <p className="text-gray-400">No location specified</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right column - Bio, skills, and other details */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Bio */}
                  <div className="bg-bgCard dark:bg-bgCard-dark rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-medium mb-4">About Me</h3>

                    {editing ? (
                      <textarea
                        name="bio"
                        value={formData.bio || ""}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary dark:bg-bgSecondary-dark dark:text-text-dark dark:border-border-dark"
                        placeholder="Tell us about yourself..."
                        rows={5}
                      />
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {userProfile.profile.bio || "No bio added yet."}
                      </p>
                    )}
                  </div>

                  {/* Technologies/Skills */}
                  <div className="bg-bgCard dark:bg-bgCard-dark rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-medium mb-4">
                      Skills & Technologies
                    </h3>

                    {editing ? (
                      <>
                        <div className="flex gap-2 mb-4">
                          <input
                            type="text"
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            className="flex-1 p-2 border rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary dark:bg-bgSecondary-dark dark:text-text-dark dark:border-border-dark"
                            placeholder="Add a skill or technology"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddTech();
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleAddTech}
                            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                          >
                            Add
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {formData.technologies &&
                          formData.technologies.length > 0 ? (
                            formData.technologies.map((tech, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                              >
                                {tech}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTech(tech)}
                                  className="ml-1 text-gray-500 hover:text-red-500"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-400">
                              No technologies added yet.
                            </p>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {userProfile.profile.technologies &&
                        userProfile.profile.technologies.length > 0 ? (
                          userProfile.profile.technologies.map(
                            (tech, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                              >
                                {tech}
                              </span>
                            )
                          )
                        ) : (
                          <p className="text-gray-400">
                            No technologies added yet.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Company Details (only for employers) */}
                  {userProfile.role === "employer" && (
                    <div className="bg-bgCard dark:bg-bgCard-dark rounded-lg shadow-md p-6">
                      <h3 className="text-lg font-medium mb-4">
                        Company Details
                      </h3>

                      {editing ? (
                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="companyName"
                              className="block text-sm font-medium mb-1"
                            >
                              Company Name
                            </label>
                            <input
                              type="text"
                              id="companyName"
                              name="companyDetails.companyName"
                              value={formData.companyDetails?.companyName || ""}
                              onChange={handleInputChange}
                              className="w-full p-2 border rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary dark:bg-bgSecondary-dark dark:text-text-dark dark:border-border-dark"
                              placeholder="Company name"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="website"
                              className="block text-sm font-medium mb-1"
                            >
                              Company Website
                            </label>
                            <input
                              type="text"
                              id="website"
                              name="companyDetails.website"
                              value={formData.companyDetails?.website || ""}
                              onChange={handleInputChange}
                              className="w-full p-2 border rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary dark:bg-bgSecondary-dark dark:text-text-dark dark:border-border-dark"
                              placeholder="https://your-company.com"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="companyAbout"
                              className="block text-sm font-medium mb-1"
                            >
                              About Company
                            </label>
                            <textarea
                              id="companyAbout"
                              name="companyDetails.about"
                              value={formData.companyDetails?.about || ""}
                              onChange={handleInputChange}
                              className="w-full p-2 border rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary dark:bg-bgSecondary-dark dark:text-text-dark dark:border-border-dark"
                              placeholder="Tell us about your company..."
                              rows={4}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {userProfile.profile.companyDetails?.companyName ? (
                            <div className="flex items-center gap-2">
                              <Building2 size={18} className="text-gray-500" />
                              <span className="font-medium">
                                {userProfile.profile.companyDetails.companyName}
                              </span>
                            </div>
                          ) : (
                            <p className="text-gray-400">
                              No company name specified
                            </p>
                          )}

                          {userProfile.profile.companyDetails?.website && (
                            <div>
                              <a
                                href={
                                  userProfile.profile.companyDetails.website
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                {userProfile.profile.companyDetails.website}
                              </a>
                            </div>
                          )}

                          {userProfile.profile.companyDetails?.about && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                About the company
                              </h4>
                              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                {userProfile.profile.companyDetails.about}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Submit buttons (only show when editing) */}
                  {editing && (
                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={handleEditToggle}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors flex items-center gap-2"
                        disabled={profileLoading}
                      >
                        {profileLoading ? (
                          "Saving..."
                        ) : (
                          <>
                            <Check size={18} /> Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
