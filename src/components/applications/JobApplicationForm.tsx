"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Toast, { ToastType } from "@/components/ui/toast.alert";
import {
  AdditionalMaterialDto,
  CreateApplicationDto,
  PortfolioLinkDto,
  ProfessionalProfilesDto,
  ResumeInfoDto,
} from "@/types/application";
import { createApplication } from "@/services/applications.api";
import LoadingIndicator from "../ui/Loading";

const JobApplicationForm = ({
  jobId,
  jobTitle,
}: {
  jobId: string;
  jobTitle: string;
}) => {
  const { token } = useAuth();
  const router = useRouter();
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeInfo, setResumeInfo] = useState<ResumeInfoDto>({
    format: "link",
    content: "",
  });
  const [portfolioLinks, setPortfolioLinks] = useState<PortfolioLinkDto[]>([]);
  const [relevantExperience, setRelevantExperience] = useState<string[]>([]);
  const [additionalMaterials, setAdditionalMaterials] = useState<
    AdditionalMaterialDto[]
  >([]);
  const [professionalProfiles, setProfessionalProfiles] =
    useState<ProfessionalProfilesDto | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{
    show: boolean;
    type: ToastType;
    message: string;
  }>({
    show: false,
    type: "info",
    message: "",
  });

  const showToast = (type: ToastType, message: string) => {
    setToast({ show: true, type, message });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const applicationData: CreateApplicationDto = {
      jobId,
      coverLetter,
      resumeInfo,
      portfolio: portfolioLinks.length ? { links: portfolioLinks } : undefined,
      relevantExperience,
      additionalMaterials: additionalMaterials.length
        ? additionalMaterials
        : undefined,
      professionalProfiles: professionalProfiles || undefined,
      notes: notes || undefined,
    };

    try {
      if (!token) {
        showToast("error", "Authentication token is missing. Please log in.");
        setLoading(false);
        return;
      }
      await createApplication(applicationData, token);

      showToast("success", "Application submitted successfully!");

      // Navigate after a short delay to show the success message
      setTimeout(() => {
        router.push(`/jobs/${jobId}`);
      }, 2000);
    } catch (error) {
      console.error(error);
      showToast(
        "error",
        error instanceof Error
          ? error.message
          : "An error occurred while submitting the application"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClassName =
    "mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100";
  const labelClassName =
    "block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div className="relative">
      {loading && <LoadingIndicator />}
      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Apply for Job "{jobTitle}"
        </h1>

        <div>
          <label htmlFor="coverLetter" className={labelClassName}>
            Cover Letter (Required, min 100 characters)
          </label>
          <textarea
            id="coverLetter"
            name="coverLetter"
            rows={5}
            className={inputClassName}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="resumeInfo" className={labelClassName}>
            Resume Link (Required)
          </label>
          <textarea
            id="resumeInfo"
            name="resumeInfo"
            rows={3}
            className={inputClassName}
            value={resumeInfo.content}
            onChange={(e) =>
              setResumeInfo({ ...resumeInfo, content: e.target.value })
            }
            required
            placeholder="Paste the URL to your resume"
          />
        </div>

        <div>
          <label htmlFor="portfolioLinks" className={labelClassName}>
            Portfolio Links (Optional, one per line in format "Title: URL")
          </label>
          <textarea
            id="portfolioLinks"
            name="portfolioLinks"
            rows={3}
            className={inputClassName}
            value={portfolioLinks
              .map((link) => `${link.title}: ${link.url}`)
              .join("\n")}
            onChange={(e) =>
              setPortfolioLinks(
                e.target.value
                  .split("\n")
                  .filter((line) => line.trim() !== "")
                  .map((line) => {
                    const [title, url] = line.split(": ");
                    return { title, url } as PortfolioLinkDto;
                  })
              )
            }
            placeholder="Project Name: https://example.com"
          />
        </div>

        <div>
          <label htmlFor="relevantExperience" className={labelClassName}>
            Relevant Experience (Optional, one experience per line)
          </label>
          <textarea
            id="relevantExperience"
            name="relevantExperience"
            rows={3}
            className={inputClassName}
            value={relevantExperience.join("\n")}
            onChange={(e) =>
              setRelevantExperience(
                e.target.value.split("\n").filter((line) => line.trim() !== "")
              )
            }
            placeholder="Describe your relevant experience"
          />
        </div>

        <div>
          <label htmlFor="additionalMaterials" className={labelClassName}>
            Additional Materials (Optional, one per line in format "Title: URL")
          </label>
          <textarea
            id="additionalMaterials"
            name="additionalMaterials"
            rows={3}
            className={inputClassName}
            value={additionalMaterials
              .map((material) => `${material.title}: ${material.url}`)
              .join("\n")}
            onChange={(e) =>
              setAdditionalMaterials(
                e.target.value
                  .split("\n")
                  .filter((line) => line.trim() !== "")
                  .map((line) => {
                    const [title, url] = line.split(": ");
                    return { title, url } as AdditionalMaterialDto;
                  })
              )
            }
            placeholder="Certificate: https://example.com/certificate"
          />
        </div>

        <div>
          <label htmlFor="professionalProfiles" className={labelClassName}>
            Professional Profiles (Optional, one profile per line)
          </label>
          <textarea
            id="professionalProfiles"
            name="professionalProfiles"
            rows={3}
            className={inputClassName}
            value={
              professionalProfiles
                ? `${professionalProfiles.linkedin || ""}\n${
                    professionalProfiles.github || ""
                  }\n${professionalProfiles.website || ""}`
                : ""
            }
            onChange={(e) => {
              const lines = e.target.value
                .split("\n")
                .map((line) => line.trim());
              setProfessionalProfiles({
                linkedin: lines[0] || "",
                github: lines[1] || "",
                website: lines[2] || "",
              } as ProfessionalProfilesDto);
            }}
            placeholder="LinkedIn: https://linkedin.com/in/yourprofile
GitHub: https://github.com/yourusername
Personal Website: https://yourwebsite.com"
          />
        </div>

        <div>
          <label htmlFor="notes" className={labelClassName}>
            Additional Notes (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className={inputClassName}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional information you'd like to share"
          />
        </div>

        <button
          type="submit"
          className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default JobApplicationForm;
