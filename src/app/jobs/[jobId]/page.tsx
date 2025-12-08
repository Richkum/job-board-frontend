// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { Job } from "@/types/jobs";
// import { format } from "date-fns";
// import {
//   FiBriefcase,
//   FiMapPin,
//   FiDollarSign,
//   FiClock,
//   FiUser,
//   FiArrowLeft,
//   FiExternalLink,
// } from "react-icons/fi";
// import LoadingIndicator from "@/components/ui/Loading";
// import { useAuth } from "@/context/AuthContext";
// import DashboardLayout from "@/components/laoyout/DashboardLayout";
// import ProtectedRoute from "@/components/ProtectedRoute";
// import { getJobDetails, incrementJobViews } from "@/services/job.api";
// import JobApplicationButton from "@/components/jobs/JobApplicationButton";

// export default function JobDetailsPage() {
//   const { jobId } = useParams();
//   const router = useRouter();
//   const { token, isAuthenticated, isLoading: authLoading } = useAuth();
//   const [job, setJob] = useState<Job | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [imageError, setImageError] = useState(false);

//   // Check if this is a crawled job
//   const isCrawled = job
//     ? !!(job as any).isCrawled || !!(job as any).source
//     : false;

//   useEffect(() => {
//     if (!authLoading && isAuthenticated && token && jobId) {
//       fetchJobDetails();
//     }
//   }, [jobId, authLoading, isAuthenticated, token]);

//   const fetchJobDetails = async () => {
//     if (!token || !jobId) return;

//     try {
//       setLoading(true);
//       const jobData = await getJobDetails(jobId as string, token);
//       setJob({
//         ...jobData,
//         poster:
//           jobData.poster ||
//           (jobData as any).companyLogo ||
//           "/default-poster.png",
//         _id: jobData._id || jobId,
//       } as Job);

//       // Increment view count (only for regular jobs)
//       if (!(jobData as any).isCrawled) {
//         await incrementJobViews(jobId as string, token);
//       }
//     } catch (error) {
//       console.error("Failed to fetch job details:", error);
//       setError("Failed to load job details. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatSalary = (salary?: Job["salary"]) => {
//     if (!salary?.range) return "Salary not specified";
//     const { range, currency, period, isNegotiable } = salary;

//     if (!range.min && !range.max)
//       return isNegotiable ? "Salary negotiable" : "Salary not specified";

//     const formatNumber = (num: number) =>
//       new Intl.NumberFormat("en-US").format(num);

//     let salaryRange = "";
//     if (range.min && range.max) {
//       salaryRange = `${formatNumber(range.min)} - ${formatNumber(range.max)}`;
//     } else if (range.min) {
//       salaryRange = `From ${formatNumber(range.min)}`;
//     } else if (range.max) {
//       salaryRange = `Up to ${formatNumber(range.max)}`;
//     }

//     return `${currency} ${salaryRange} per ${period}${
//       isNegotiable ? " (Negotiable)" : ""
//     }`;
//   };

//   // Safe date formatting - handles both regular and crawled jobs
//   const formatDeadline = () => {
//     if (!job) return "No deadline";

//     try {
//       const deadline =
//         job.applicationDeadline ||
//         (job as any).expirationDate ||
//         (job as any).postedDate;
//       if (!deadline) return "No deadline";

//       const date = new Date(deadline);
//       if (isNaN(date.getTime())) return "No deadline";

//       return format(date, "MMM dd, yyyy");
//     } catch (error) {
//       return "No deadline";
//     }
//   };

//   if (authLoading || loading) {
//     return (
//       <DashboardLayout>
//         <div className="flex flex-col items-center justify-center min-h-screen">
//           <LoadingIndicator />
//         </div>
//       </DashboardLayout>
//     );
//   }

//   if (!isAuthenticated) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-bg dark:bg-bg-dark">
//         <h2 className="text-2xl font-bold text-text dark:text-text-dark mb-4">
//           Please login to view job details
//         </h2>
//         <p className="text-textSecondary dark:text-textSecondary-dark">
//           You need to be logged in to access this page
//         </p>
//       </div>
//     );
//   }

//   if (error || !job) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-bg dark:bg-bg-dark">
//         <h2 className="text-2xl font-bold text-text dark:text-text-dark mb-4">
//           {error || "Job not found"}
//         </h2>
//       </div>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <div className="min-h-screen bg-bg dark:bg-bg-dark">
//         <div className="max-w-4xl mx-auto px-4 py-8">
//           {/* Back Button */}
//           <button
//             onClick={() => router.back()}
//             className="flex items-center text-textSecondary dark:text-textSecondary-dark
//                        hover:text-primary mb-6 transition-colors duration-200"
//           >
//             <FiArrowLeft className="mr-2" />
//             Back to Jobs
//           </button>

//           {/* Crawled Job Alert */}
//           {isCrawled && (
//             <div className="mb-6 bg-accent/10 border border-accent/20 rounded-lg p-4">
//               <div className="flex items-start gap-3">
//                 <FiExternalLink className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
//                 <div>
//                   <h3 className="font-semibold text-accent mb-1">
//                     External Job Posting
//                   </h3>
//                   <p className="text-sm text-textSecondary dark:text-textSecondary-dark">
//                     This job was aggregated from{" "}
//                     {(job as any).source || "an external source"}. You'll be
//                     redirected to the original posting to apply.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Job Header */}
//           <div className="bg-white dark:bg-bgCard-dark rounded-lg p-6 shadow-sm">
//             <div className="flex items-start gap-6">
//               {/* Company Logo */}
//               <div className="flex-shrink-0">
//                 {!imageError ? (
//                   <img
//                     src={
//                       job.poster ||
//                       (job as any).companyLogo ||
//                       "/company-placeholder.png"
//                     }
//                     alt={`${
//                       job.company?.name || (job as any).companyName || "Company"
//                     } logo`}
//                     className="w-16 h-16 rounded-lg object-cover bg-bgSecondary dark:bg-bgSecondary-dark"
//                     onError={() => setImageError(true)}
//                   />
//                 ) : (
//                   <div
//                     className="w-16 h-16 rounded-lg bg-bgSecondary dark:bg-bgSecondary-dark
//                             flex items-center justify-center"
//                   >
//                     <FiBriefcase className="w-8 h-8 text-textMuted dark:text-textMuted-dark" />
//                   </div>
//                 )}
//               </div>

//               {/* Job Title and Company */}
//               <div className="flex-grow">
//                 <h1 className="text-2xl font-bold text-text dark:text-text-dark">
//                   {job.title}
//                 </h1>
//                 <p className="text-lg text-textSecondary dark:text-textSecondary-dark mt-1">
//                   {job.company?.name ||
//                     (job as any).companyName ||
//                     "Company Name"}
//                 </p>
//                 {(job.subtitle || job.description) && (
//                   <p className="text-textMuted dark:text-textMuted-dark mt-2 line-clamp-2">
//                     {job.subtitle || job.description?.substring(0, 150)}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Job Quick Info */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
//               <div className="flex items-center">
//                 <div className="flex flex-col gap-1">
//                   <p className="text-sm text-textMuted dark:text-textMuted-dark">
//                     Job Type
//                   </p>
//                   <div className="flex items-center">
//                     <FiBriefcase className="w-4 h-4 mr-2 text-textMuted dark:text-textMuted-dark" />
//                     <span className="text-sm text-textSecondary dark:text-textSecondary-dark">
//                       {job.jobType || "Full-time"}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center">
//                 <div className="flex flex-col gap-1">
//                   <p className="text-sm text-textMuted dark:text-textMuted-dark">
//                     Location
//                   </p>
//                   <div className="flex items-center">
//                     <FiMapPin className="w-4 h-4 mr-2 text-textMuted dark:text-textMuted-dark" />
//                     <span className="text-sm text-textSecondary dark:text-textSecondary-dark">
//                       {job.location?.type || "On-site"}
//                       {job.location?.city && ` • ${job.location.city}`}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center">
//                 <div className="flex flex-col gap-1">
//                   <p className="text-sm text-textMuted dark:text-textMuted-dark">
//                     Experience level
//                   </p>
//                   <div className="flex items-center">
//                     <FiUser className="w-4 h-4 mr-2 text-textMuted dark:text-textMuted-dark" />
//                     <span className="text-sm text-textSecondary dark:text-textSecondary-dark">
//                       {job.experienceLevel || "Any"}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center">
//                 <div className="flex flex-col gap-1">
//                   <p className="text-sm text-textMuted dark:text-textMuted-dark">
//                     {isCrawled ? "Posted Date" : "Application Deadline"}
//                   </p>
//                   <div className="flex items-center">
//                     <FiClock className="w-4 h-4 mr-2 text-textMuted dark:text-textMuted-dark" />
//                     <span className="text-sm text-textSecondary dark:text-textSecondary-dark">
//                       {formatDeadline()}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Salary */}
//             <div className="mt-6 flex items-center">
//               <FiDollarSign className="w-5 h-5 mr-2 text-success" />
//               <span className="text-success font-medium">
//                 {formatSalary(job.salary)}
//               </span>
//             </div>
//           </div>

//           {/* Application Button */}
//           {isCrawled ? (
//             <a
//               href={(job as any).externalUrl || (job as any).applyUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="mt-6 w-full inline-flex items-center justify-center gap-2
//                          bg-primary hover:bg-primary-dark text-white font-semibold
//                          py-3 px-6 rounded-lg transition-colors duration-200"
//             >
//               Apply on {(job as any).source || "External Site"}
//               <FiExternalLink className="w-4 h-4" />
//             </a>
//           ) : (
//             <JobApplicationButton
//               jobId={Array.isArray(jobId) ? jobId[0] : jobId || ""}
//               deadline={job.applicationDeadline}
//               className="mt-6"
//             />
//           )}

//           {/* Job Description */}
//           <div className="mt-6 bg-white dark:bg-bgCard-dark rounded-lg p-6 shadow-sm">
//             <h2 className="text-xl font-semibold mb-4">Job Description</h2>
//             <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
//               {job.description}
//             </div>
//           </div>

//           {/* Requirements */}
//           {job.requirements && job.requirements.length > 0 && (
//             <div className="mt-6 bg-white dark:bg-bgCard-dark rounded-lg p-6 shadow-sm">
//               <h2 className="text-xl font-semibold mb-4">Requirements</h2>
//               <ul className="list-disc pl-5 space-y-2">
//                 {job.requirements.map((req, index) => (
//                   <li
//                     key={index}
//                     className="text-textSecondary dark:text-textSecondary-dark"
//                   >
//                     {req}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {/* Technical Requirements */}
//           {((job.technicalRequirements &&
//             job.technicalRequirements.length > 0) ||
//             ((job as any).tags && (job as any).tags.length > 0)) && (
//             <div className="mt-6 bg-white dark:bg-bgCard-dark rounded-lg p-6 shadow-sm">
//               <h2 className="text-xl font-semibold mb-4">
//                 Technical Requirements
//               </h2>
//               <div className="flex flex-wrap gap-2">
//                 {(job.technicalRequirements || (job as any).tags || []).map(
//                   (tech: string, index: number) => (
//                     <span
//                       key={index}
//                       className="px-3 py-1 rounded-full
//                                bg-accent/10 text-accent dark:text-accent-light
//                                border border-accent/20"
//                     >
//                       {tech}
//                     </span>
//                   )
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Benefits */}
//           {job.benefits && job.benefits.length > 0 && (
//             <div className="mt-6 bg-white dark:bg-bgCard-dark rounded-lg p-6 shadow-sm">
//               <h2 className="text-xl font-semibold mb-4">Benefits</h2>
//               <ul className="list-disc pl-5 space-y-2">
//                 {job.benefits.map((benefit, index) => (
//                   <li
//                     key={index}
//                     className="text-textSecondary dark:text-textSecondary-dark"
//                   >
//                     {benefit}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {/* Company Website (for crawled jobs) */}
//           {isCrawled && (job as any).companyUrl && (
//             <div className="mt-6 bg-white dark:bg-bgCard-dark rounded-lg p-6 shadow-sm">
//               <h2 className="text-xl font-semibold mb-4">Company</h2>
//               <a
//                 href={(job as any).companyUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-primary hover:text-primary-dark flex items-center gap-2"
//               >
//                 Visit {job.company?.name || (job as any).companyName} website
//                 <FiExternalLink className="w-4 h-4" />
//               </a>
//             </div>
//           )}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Job } from "@/types/jobs";
import {
  FiBriefcase,
  FiMapPin,
  FiDollarSign,
  FiClock,
  FiUser,
  FiArrowLeft,
  FiExternalLink,
} from "react-icons/fi";
import { Briefcase } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import LoadingIndicator from "@/components/ui/Loading";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/laoyout/DashboardLayout";
import JobApplicationButton from "@/components/jobs/JobApplicationButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getPublicJobDetails = async (jobId: string): Promise<Job> => {
  try {
    const response = await fetch(`${API_URL}/jobs/${jobId}/details`);
    if (!response.ok) throw new Error("Failed to fetch job details");
    return response.json();
  } catch (error) {
    console.error("Fetch job details error:", error);
    throw error;
  }
};

const incrementPublicJobViews = async (jobId: string): Promise<void> => {
  try {
    await fetch(`${API_URL}/jobs/${jobId}/view`, { method: "PUT" });
  } catch (error) {
    console.error("Failed to increment views:", error);
  }
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "No deadline";

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
  } catch (error) {
    return "No deadline";
  }
};

export default function JobDetailsPage() {
  const { jobId } = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const isCrawled = job
    ? !!(job as any).isCrawled || !!(job as any).source
    : false;

  useEffect(() => {
    if (!authLoading && jobId) {
      fetchJobDetails();
    }
  }, [jobId, authLoading]);

  const fetchJobDetails = async () => {
    if (!jobId) return;

    try {
      setLoading(true);
      const jobData = await getPublicJobDetails(jobId as string);
      setJob({
        ...jobData,
        poster:
          jobData.poster ||
          (jobData as any).companyLogo ||
          "/default-poster.png",
        _id: jobData._id || jobId,
      } as Job);

      if (!(jobData as any).isCrawled) {
        await incrementPublicJobViews(jobId as string);
      }
    } catch (error) {
      console.error("Failed to fetch job details:", error);
      setError("Failed to load job details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (salary?: Job["salary"]) => {
    if (!salary?.range) return "Salary not specified";
    const { range, currency, period, isNegotiable } = salary;

    if (!range.min && !range.max)
      return isNegotiable ? "Salary negotiable" : "Salary not specified";

    const formatNumber = (num: number) =>
      new Intl.NumberFormat("en-US").format(num);

    let salaryRange = "";
    if (range.min && range.max) {
      salaryRange = `${formatNumber(range.min)} - ${formatNumber(range.max)}`;
    } else if (range.min) {
      salaryRange = `From ${formatNumber(range.min)}`;
    } else if (range.max) {
      salaryRange = `Up to ${formatNumber(range.max)}`;
    }

    return `${currency} ${salaryRange} per ${period}${
      isNegotiable ? " (Negotiable)" : ""
    }`;
  };

  const formatDeadline = () => {
    if (!job) return "No deadline";

    try {
      const deadline =
        job.applicationDeadline ||
        (job as any).expirationDate ||
        (job as any).postedDate;
      if (!deadline) return "No deadline";

      return formatDate(deadline);
    } catch (error) {
      return "No deadline";
    }
  };

  const PublicHeader = () => (
    <header className="border-b border-border dark:border-border-dark sticky top-0 z-50 bg-white/80 dark:bg-bg-dark/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="bg-gradient-to-br from-primary to-secondary text-white p-2 rounded-lg shadow-lg group-hover:shadow-xl transition-shadow">
            <Briefcase size={20} />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            JobConnect
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <div className="flex space-x-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg border border-border dark:border-border-dark text-textSecondary dark:text-textSecondary-dark hover:bg-bgSecondary dark:hover:bg-bgSecondary-dark transition-all text-sm md:text-base"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white transition-all shadow-lg hover:shadow-xl text-sm md:text-base"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );

  const JobDetailsContent = () => (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center text-textSecondary dark:text-textSecondary-dark 
                   hover:text-primary mb-6 transition-colors duration-200"
      >
        <FiArrowLeft className="mr-2" />
        Back to Jobs
      </button>

      {isCrawled && (
        <div className="mb-6 bg-accent/10 border border-accent/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FiExternalLink className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-accent mb-1">
                External Job Posting
              </h3>
              <p className="text-sm text-textSecondary dark:text-textSecondary-dark">
                This job was aggregated from{" "}
                {(job as any).source || "an external source"}. You'll be
                redirected to the original posting to apply.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-bgCard-dark rounded-lg p-4 md:p-6 shadow-sm border border-border dark:border-border-dark">
        <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
          <div className="flex-shrink-0">
            {!imageError ? (
              <img
                src={
                  job?.poster ||
                  (job as any)?.companyLogo ||
                  "/company-placeholder.png"
                }
                alt={`${
                  job?.company?.name || (job as any)?.companyName || "Company"
                } logo`}
                className="w-16 h-16 rounded-lg object-cover bg-bgSecondary dark:bg-bgSecondary-dark"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-bgSecondary dark:bg-bgSecondary-dark flex items-center justify-center">
                <FiBriefcase className="w-8 h-8 text-textMuted dark:text-textMuted-dark" />
              </div>
            )}
          </div>

          <div className="flex-grow">
            <h1 className="text-xl md:text-2xl font-bold text-text dark:text-text-dark">
              {job?.title}
            </h1>
            <p className="text-base md:text-lg text-textSecondary dark:text-textSecondary-dark mt-1">
              {job?.company?.name ||
                (job as any)?.companyName ||
                "Company Name"}
            </p>
            {(job?.subtitle || job?.description) && (
              <p className="text-sm md:text-base text-textMuted dark:text-textMuted-dark mt-2 line-clamp-2">
                {job?.subtitle || job?.description?.substring(0, 150)}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="flex flex-col gap-1">
            <p className="text-xs md:text-sm text-textMuted dark:text-textMuted-dark">
              Job Type
            </p>
            <div className="flex items-center">
              <FiBriefcase className="w-4 h-4 mr-2 text-textMuted dark:text-textMuted-dark" />
              <span className="text-sm text-textSecondary dark:text-textSecondary-dark">
                {job?.jobType || "Full-time"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-xs md:text-sm text-textMuted dark:text-textMuted-dark">
              Location
            </p>
            <div className="flex items-center">
              <FiMapPin className="w-4 h-4 mr-2 text-textMuted dark:text-textMuted-dark" />
              <span className="text-sm text-textSecondary dark:text-textSecondary-dark truncate">
                {job?.location?.type || "On-site"}
                {job?.location?.city && ` • ${job.location.city}`}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-xs md:text-sm text-textMuted dark:text-textMuted-dark">
              Experience
            </p>
            <div className="flex items-center">
              <FiUser className="w-4 h-4 mr-2 text-textMuted dark:text-textMuted-dark" />
              <span className="text-sm text-textSecondary dark:text-textSecondary-dark">
                {job?.experienceLevel || "Any"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-xs md:text-sm text-textMuted dark:text-textMuted-dark">
              {isCrawled ? "Posted" : "Deadline"}
            </p>
            <div className="flex items-center">
              <FiClock className="w-4 h-4 mr-2 text-textMuted dark:text-textMuted-dark" />
              <span className="text-sm text-textSecondary dark:text-textSecondary-dark">
                {formatDeadline()}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center">
          <FiDollarSign className="w-5 h-5 mr-2 text-success" />
          <span className="text-sm md:text-base text-success font-medium">
            {formatSalary(job?.salary)}
          </span>
        </div>
      </div>

      {!isAuthenticated && (
        <div className="mt-6 bg-primary/10 border border-primary/20 rounded-lg p-4 md:p-6">
          <p className="text-sm text-textSecondary dark:text-textSecondary-dark mb-4 text-center">
            Sign in or create an account to apply for this position
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login"
              className="px-6 py-3 text-center rounded-lg border border-primary text-primary hover:bg-primary/10 transition-all font-medium"
            >
              Log In to Apply
            </Link>
            <Link
              href="/signup"
              className="px-6 py-3 text-center rounded-lg bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white transition-all shadow-lg hover:shadow-xl font-medium"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}

      {isAuthenticated && !isCrawled && (
        <JobApplicationButton
          jobId={Array.isArray(jobId) ? jobId[0] : jobId || ""}
          deadline={job?.applicationDeadline}
          className="mt-6"
        />
      )}

      {isCrawled && (
        <a
          href={(job as any)?.externalUrl || (job as any)?.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 w-full inline-flex items-center justify-center gap-2
                     bg-primary hover:bg-primary-dark text-white font-semibold
                     py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Apply on {(job as any)?.source || "External Site"}
          <FiExternalLink className="w-4 h-4" />
        </a>
      )}

      <div className="mt-6 bg-white dark:bg-bgCard-dark rounded-lg p-4 md:p-6 shadow-sm border border-border dark:border-border-dark">
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-text dark:text-text-dark">
          Job Description
        </h2>
        <div className="prose dark:prose-invert max-w-none text-sm md:text-base whitespace-pre-wrap text-textSecondary dark:text-textSecondary-dark">
          {job?.description}
        </div>
      </div>

      {job?.requirements && job.requirements.length > 0 && (
        <div className="mt-6 bg-white dark:bg-bgCard-dark rounded-lg p-4 md:p-6 shadow-sm border border-border dark:border-border-dark">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-text dark:text-text-dark">
            Requirements
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            {job.requirements.map((req, index) => (
              <li
                key={index}
                className="text-sm md:text-base text-textSecondary dark:text-textSecondary-dark"
              >
                {req}
              </li>
            ))}
          </ul>
        </div>
      )}

      {((job?.technicalRequirements && job.technicalRequirements.length > 0) ||
        ((job as any)?.tags && (job as any).tags.length > 0)) && (
        <div className="mt-6 bg-white dark:bg-bgCard-dark rounded-lg p-4 md:p-6 shadow-sm border border-border dark:border-border-dark">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-text dark:text-text-dark">
            Technical Requirements
          </h2>
          <div className="flex flex-wrap gap-2">
            {(job?.technicalRequirements || (job as any)?.tags || []).map(
              (tech: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs md:text-sm rounded-full
                           bg-accent/10 text-accent dark:text-accent-light
                           border border-accent/20"
                >
                  {tech}
                </span>
              )
            )}
          </div>
        </div>
      )}

      {job?.benefits && job.benefits.length > 0 && (
        <div className="mt-6 bg-white dark:bg-bgCard-dark rounded-lg p-4 md:p-6 shadow-sm border border-border dark:border-border-dark">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-text dark:text-text-dark">
            Benefits
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            {job.benefits.map((benefit, index) => (
              <li
                key={index}
                className="text-sm md:text-base text-textSecondary dark:text-textSecondary-dark"
              >
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      )}

      {isCrawled && (job as any)?.companyUrl && (
        <div className="mt-6 bg-white dark:bg-bgCard-dark rounded-lg p-4 md:p-6 shadow-sm border border-border dark:border-border-dark">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-text dark:text-text-dark">
            Company
          </h2>
          <a
            href={(job as any).companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm md:text-base text-primary hover:text-primary-dark flex items-center gap-2"
          >
            Visit {job?.company?.name || (job as any)?.companyName} website
            <FiExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-bg dark:bg-bg-dark flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-bg dark:bg-bg-dark">
        <PublicHeader />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <h2 className="text-xl md:text-2xl font-bold text-text dark:text-text-dark mb-4 text-center">
            {error || "Job not found"}
          </h2>
          <Link
            href="/"
            className="mt-4 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-bg dark:bg-bg-dark">
          <JobDetailsContent />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark">
      <PublicHeader />
      <JobDetailsContent />

      <footer className="border-t border-border dark:border-border-dark bg-white dark:bg-bgCard-dark mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-primary to-secondary text-white p-1.5 rounded-lg">
                <Briefcase size={18} />
              </div>
              <span className="font-semibold text-text dark:text-text-dark">
                JobConnect
              </span>
            </div>
            <p className="text-sm text-textSecondary dark:text-textSecondary-dark text-center">
              &copy; {new Date().getFullYear()} JobConnect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
