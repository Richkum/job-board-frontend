// // "use client";

// // import { useEffect, useState } from "react";
// // import { useParams, useRouter } from "next/navigation";
// // import { Job } from "@/types/jobs";
// // import { format } from "date-fns";
// // import {
// //   FiBriefcase,
// //   FiMapPin,
// //   FiDollarSign,
// //   FiClock,
// //   FiUser,
// //   FiArrowLeft,
// // } from "react-icons/fi";
// // import LoadingIndicator from "@/components/ui/Loading";
// // import { useAuth } from "@/context/AuthContext";
// // import DashboardLayout from "@/components/laoyout/DashboardLayout";
// // import ProtectedRoute from "@/components/ProtectedRoute";
// // import { getJobDetails, incrementJobViews } from "@/services/job.api";
// // import JobApplicationButton from "@/components/jobs/JobApplicationButton";

// // export default function JobDetailsPage() {
// //   const { jobId } = useParams();
// //   const router = useRouter();
// //   const { token, isAuthenticated, isLoading: authLoading } = useAuth();
// //   const [job, setJob] = useState<Job | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [imageError, setImageError] = useState(false);
// //   const [isApplying, setIsApplying] = useState(false);

// //   useEffect(() => {
// //     if (!authLoading && isAuthenticated && token && jobId) {
// //       fetchJobDetails();
// //     }
// //   }, [jobId, authLoading, isAuthenticated, token]);

// //   const fetchJobDetails = async () => {
// //     if (!token || !jobId) return;

// //     try {
// //       setLoading(true);
// //       const jobData = await getJobDetails(jobId as string, token);
// //       setJob({
// //         ...jobData,
// //         poster: jobData.poster || "/default-poster.png", // Provide a default value if missing
// //         _id: jobData._id || jobId, // Use jobId as a fallback for _id
// //       } as Job);

// //       // Increment view count
// //       await incrementJobViews(jobId as string, token);
// //     } catch (error) {
// //       console.error("Failed to fetch job details:", error);
// //       setError("Failed to load job details. Please try again later.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const formatSalary = (salary?: Job["salary"]) => {
// //     if (!salary?.range) return "Salary not specified";
// //     const { range, currency, period, isNegotiable } = salary;

// //     if (!range.min && !range.max)
// //       return isNegotiable ? "Salary negotiable" : "Salary not specified";

// //     const formatNumber = (num: number) =>
// //       new Intl.NumberFormat("en-US").format(num);

// //     let salaryRange = "";
// //     if (range.min && range.max) {
// //       salaryRange = `${formatNumber(range.min)} - ${formatNumber(range.max)}`;
// //     } else if (range.min) {
// //       salaryRange = `From ${formatNumber(range.min)}`;
// //     } else if (range.max) {
// //       salaryRange = `Up to ${formatNumber(range.max)}`;
// //     }

// //     return `${currency} ${salaryRange} per ${period}${
// //       isNegotiable ? " (Negotiable)" : ""
// //     }`;
// //   };

// //   if (authLoading || loading) {
// //     return (
// //       <DashboardLayout>
// //         <div className="flex flex-col items-center justify-center min-h-screen">
// //           <LoadingIndicator />
// //         </div>
// //       </DashboardLayout>
// //     );
// //   }

// //   if (!isAuthenticated) {
// //     return (
// //       <div
// //         className="flex flex-col items-center justify-center min-h-screen
// //                     bg-bg dark:bg-bg-dark"
// //       >
// //         <h2 className="text-2xl font-bold text-text dark:text-text-dark mb-4">
// //           Please login to view job details
// //         </h2>
// //         <p className="text-textSecondary dark:text-textSecondary-dark">
// //           You need to be logged in to access this page
// //         </p>
// //       </div>
// //     );
// //   }

// //   if (error || !job) {
// //     return (
// //       <div
// //         className="flex flex-col items-center justify-center min-h-screen
// //                     bg-bg dark:bg-bg-dark"
// //       >
// //         <h2 className="text-2xl font-bold text-text dark:text-text-dark mb-4">
// //           {error || "Job not found"}
// //         </h2>
// //       </div>
// //     );
// //   }

// //   return (
// //     <ProtectedRoute>
// //       <DashboardLayout>
// //         <div className="min-h-screen bg-bg dark:bg-bg-dark">
// //           <div className="max-w-4xl mx-auto px-4 py-8">
// //             {/* Back Button */}
// //             <button
// //               onClick={() => router.back()}
// //               className="flex items-center text-textSecondary dark:text-textSecondary-dark
// //                        hover:text-primary mb-6 transition-colors duration-200"
// //             >
// //               <FiArrowLeft className="mr-2" />
// //               Back to Jobs
// //             </button>

// //             {/* Job Header */}
// //             <div className="bg-white dark:bg-bgCard-dark rounded-lg p-6 shadow-sm">
// //               <div className="flex items-start gap-6">
// //                 {/* Company Logo */}
// //                 <div className="flex-shrink-0">
// //                   {!imageError ? (
// //                     <img
// //                       src={job.poster || "/company-placeholder.png"}
// //                       alt={`${job.poster || "Company"} logo`}
// //                       className="w-12 h-12 rounded-lg object-cover bg-bgSecondary dark:bg-bgSecondary-dark"
// //                       onError={() => setImageError(true)}
// //                     />
// //                   ) : (
// //                     <div
// //                       className="w-12 h-12 rounded-lg bg-bgSecondary dark:bg-bgSecondary-dark
// //                             flex items-center justify-center"
// //                     >
// //                       <FiBriefcase className="w-6 h-6 text-textMuted dark:text-textMuted-dark" />
// //                     </div>
// //                   )}
// //                 </div>

// //                 {/* Job Title and Company */}
// //                 <div>
// //                   <h1 className="text-2xl font-bold text-text dark:text-text-dark">
// //                     {job.title}
// //                   </h1>
// //                   <p className="text-lg text-textSecondary dark:text-textSecondary-dark mt-1">
// //                     {job.company?.name}
// //                   </p>
// //                   <p className="text-textMuted dark:text-textMuted-dark mt-2">
// //                     {job.subtitle}
// //                   </p>
// //                 </div>
// //               </div>

// //               {/* Job Quick Info */}
// //               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
// //                 <div className="flex items-center">
// //                   <div className="flex flex-col gap-1">
// //                     <p className="text-textSecondary dark:text-textSecondary-dark">
// //                       Job Type
// //                     </p>
// //                     <div className="flex items-center">
// //                       <FiBriefcase className="w-5 h-5 mr-2 text-textMuted dark:text-textMuted-dark" />
// //                       <span className="text-textSecondary dark:text-textSecondary-dark">
// //                         {job.jobType}
// //                       </span>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 <div className="flex items-center">
// //                   <div className="flex flex-col gap-1">
// //                     <p>Location</p>
// //                     <div className="flex items-center">
// //                       <FiMapPin className="w-5 h-5 mr-2 text-textMuted dark:text-textMuted-dark" />
// //                       <span className="text-textSecondary dark:text-textSecondary-dark">
// //                         {job.location.type}
// //                         {job.location.city && ` • ${job.location.city}`}
// //                       </span>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 <div className="flex items-center">
// //                   <div className="flex flex-col gap-1">
// //                     <p>Experience level</p>
// //                     <div className="flex items-center">
// //                       <FiUser className="w-5 h-5 mr-2 text-textMuted dark:text-textMuted-dark" />
// //                       <span className="text-textSecondary dark:text-textSecondary-dark">
// //                         {job.experienceLevel}
// //                       </span>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 <div className="flex items-center">
// //                   <div className="flex flex-col gap-1">
// //                     <p>Application Deadline</p>
// //                     <div className="flex items-center">
// //                       <FiClock className="w-5 h-5 mr-2 text-textMuted dark:text-textMuted-dark" />
// //                       <span className="text-textSecondary dark:text-textSecondary-dark">
// //                         {format(
// //                           new Date(job.applicationDeadline),
// //                           "MMM dd, yyyy"
// //                         )}
// //                       </span>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Salary */}
// //               <div className="mt-6 flex items-center">
// //                 <FiDollarSign className="w-5 h-5 mr-2 text-success" />
// //                 <span className="text-success font-medium">
// //                   {formatSalary(job.salary)}
// //                 </span>
// //               </div>
// //             </div>

// //             {/* Application Button */}
// //             <JobApplicationButton
// //               deadline={job.applicationDeadline}
// //               onApply={() => setIsApplying(true)}
// //               className="mt-6"
// //             />

// //             {/* Job Description */}
// //             <div className="mt-6 bg-white dark:bg-bgCard-dark rounded-lg p-6 shadow-sm">
// //               <h2 className="text-xl font-semibold mb-4">Job Description</h2>
// //               <div className="prose dark:prose-invert max-w-none">
// //                 {job.description}
// //               </div>
// //             </div>

// //             {/* Requirements */}
// //             <div className="mt-6 bg-white dark:bg-bgCard-dark rounded-lg p-6 shadow-sm">
// //               <h2 className="text-xl font-semibold mb-4">Requirements</h2>
// //               <ul className="list-disc pl-5 space-y-2">
// //                 {job.requirements?.map((req, index) => (
// //                   <li
// //                     key={index}
// //                     className="text-textSecondary dark:text-textSecondary-dark"
// //                   >
// //                     {req}
// //                   </li>
// //                 ))}
// //               </ul>
// //             </div>

// //             {/* Technical Requirements */}
// //             {job.technicalRequirements &&
// //               job.technicalRequirements.length > 0 && (
// //                 <div className="mt-6 bg-white dark:bg-bgCard-dark rounded-lg p-6 shadow-sm">
// //                   <h2 className="text-xl font-semibold mb-4">
// //                     Technical Requirements
// //                   </h2>
// //                   <div className="flex flex-wrap gap-2">
// //                     {job.technicalRequirements.map((tech, index) => (
// //                       <span
// //                         key={index}
// //                         className="px-3 py-1 rounded-full
// //                                bg-accent/10 text-accent dark:text-accent-light
// //                                border border-accent/20"
// //                       >
// //                         {tech}
// //                       </span>
// //                     ))}
// //                   </div>
// //                 </div>
// //               )}

// //             {/* Benefits */}
// //             {job.benefits && job.benefits.length > 0 && (
// //               <div className="mt-6 bg-white dark:bg-bgCard-dark rounded-lg p-6 shadow-sm">
// //                 <h2 className="text-xl font-semibold mb-4">Benefits</h2>
// //                 <ul className="list-disc pl-5 space-y-2">
// //                   {job.benefits.map((benefit, index) => (
// //                     <li
// //                       key={index}
// //                       className="text-textSecondary dark:text-textSecondary-dark"
// //                     >
// //                       {benefit}
// //                     </li>
// //                   ))}
// //                 </ul>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </DashboardLayout>
// //     </ProtectedRoute>
// //   );
// // }

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
//         poster: jobData.poster || "/default-poster.png", // Provide a default value if missing
//         _id: jobData._id || jobId, // Use jobId as a fallback for _id
//       } as Job);

//       // Increment view count
//       await incrementJobViews(jobId as string, token);
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
//       <div
//         className="flex flex-col items-center justify-center min-h-screen
//                     bg-bg dark:bg-bg-dark"
//       >
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
//       <div
//         className="flex flex-col items-center justify-center min-h-screen
//                     bg-bg dark:bg-bg-dark"
//       >
//         <h2 className="text-2xl font-bold text-text dark:text-text-dark mb-4">
//           {error || "Job not found"}
//         </h2>
//       </div>
//     );
//   }

//   return (
//     <ProtectedRoute>
//       <DashboardLayout>
//         <div className="min-h-screen bg-bg dark:bg-bg-dark">
//           <div className="max-w-4xl mx-auto px-4 py-8">
//             {/* Back Button */}
//             <button
//               onClick={() => router.back()}
//               className="flex items-center text-textSecondary dark:text-textSecondary-dark
//                        hover:text-primary mb-6 transition-colors duration-200"
//             >
//               <FiArrowLeft className="mr-2" />
//               Back to Jobs
//             </button>

//             {/* Job Header */}
//             <div className="bg-white dark:bg-bgCard-dark rounded-lg p-6 shadow-sm">
//               <div className="flex items-start gap-6">
//                 {/* Company Logo */}
//                 <div className="flex-shrink-0">
//                   {!imageError ? (
//                     <img
//                       src={job.poster || "/company-placeholder.png"}
//                       alt={`${job.poster || "Company"} logo`}
//                       className="w-12 h-12 rounded-lg object-cover bg-bgSecondary dark:bg-bgSecondary-dark"
//                       onError={() => setImageError(true)}
//                     />
//                   ) : (
//                     <div
//                       className="w-12 h-12 rounded-lg bg-bgSecondary dark:bg-bgSecondary-dark
//                             flex items-center justify-center"
//                     >
//                       <FiBriefcase className="w-6 h-6 text-textMuted dark:text-textMuted-dark" />
//                     </div>
//                   )}
//                 </div>

//                 {/* Job Title and Company */}
//                 <div>
//                   <h1 className="text-2xl font-bold text-text dark:text-text-dark">
//                     {job.title}
//                   </h1>
//                   <p className="text-lg text-textSecondary dark:text-textSecondary-dark mt-1">
//                     {job.company?.name}
//                   </p>
//                   <p className="text-textMuted dark:text-textMuted-dark mt-2">
//                     {job.subtitle}
//                   </p>
//                 </div>
//               </div>

//               {/* Job Quick Info */}
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
//                 <div className="flex items-center">
//                   <div className="flex flex-col gap-1">
//                     <p className="text-textSecondary dark:text-textSecondary-dark">
//                       Job Type
//                     </p>
//                     <div className="flex items-center">
//                       <FiBriefcase className="w-5 h-5 mr-2 text-textMuted dark:text-textMuted-dark" />
//                       <span className="text-textSecondary dark:text-textSecondary-dark">
//                         {job.jobType}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex items-center">
//                   <div className="flex flex-col gap-1">
//                     <p>Location</p>
//                     <div className="flex items-center">
//                       <FiMapPin className="w-5 h-5 mr-2 text-textMuted dark:text-textMuted-dark" />
//                       <span className="text-textSecondary dark:text-textSecondary-dark">
//                         {job.location.type}
//                         {job.location.city && ` • ${job.location.city}`}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex items-center">
//                   <div className="flex flex-col gap-1">
//                     <p>Experience level</p>
//                     <div className="flex items-center">
//                       <FiUser className="w-5 h-5 mr-2 text-textMuted dark:text-textMuted-dark" />
//                       <span className="text-textSecondary dark:text-textSecondary-dark">
//                         {job.experienceLevel}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex items-center">
//                   <div className="flex flex-col gap-1">
//                     <p>Application Deadline</p>
//                     <div className="flex items-center">
//                       <FiClock className="w-5 h-5 mr-2 text-textMuted dark:text-textMuted-dark" />
//                       <span className="text-textSecondary dark:text-textSecondary-dark">
//                         {format(
//                           new Date(job.applicationDeadline),
//                           "MMM dd, yyyy"
//                         )}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Salary */}
//               <div className="mt-6 flex items-center">
//                 <FiDollarSign className="w-5 h-5 mr-2 text-success" />
//                 <span className="text-success font-medium">
//                   {formatSalary(job.salary)}
//                 </span>
//               </div>
//             </div>

//             {/* Application Button */}
//             <JobApplicationButton
//               jobId={Array.isArray(jobId) ? jobId[0] : jobId || ""}
//               deadline={job.applicationDeadline}
//               className="mt-6"
//             />

//             {/* Job Description */}
//             <div className="mt-6 bg-white dark:bg-bgCard-dark rounded-lg p-6 shadow-sm">
//               <h2 className="text-xl font-semibold mb-4">Job Description</h2>
//               <div className="prose dark:prose-invert max-w-none">
//                 {job.description}
//               </div>
//             </div>

//             {/* Requirements */}
//             <div className="mt-6 bg-white dark:bg-bgCard-dark rounded-lg p-6 shadow-sm">
//               <h2 className="text-xl font-semibold mb-4">Requirements</h2>
//               <ul className="list-disc pl-5 space-y-2">
//                 {job.requirements?.map((req, index) => (
//                   <li
//                     key={index}
//                     className="text-textSecondary dark:text-textSecondary-dark"
//                   >
//                     {req}
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Technical Requirements */}
//             {job.technicalRequirements &&
//               job.technicalRequirements.length > 0 && (
//                 <div className="mt-6 bg-white dark:bg-bgCard-dark rounded-lg p-6 shadow-sm">
//                   <h2 className="text-xl font-semibold mb-4">
//                     Technical Requirements
//                   </h2>
//                   <div className="flex flex-wrap gap-2">
//                     {job.technicalRequirements.map((tech, index) => (
//                       <span
//                         key={index}
//                         className="px-3 py-1 rounded-full
//                                bg-accent/10 text-accent dark:text-accent-light
//                                border border-accent/20"
//                       >
//                         {tech}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}

//             {/* Benefits */}
//             {job.benefits && job.benefits.length > 0 && (
//               <div className="mt-6 bg-white dark:bg-bgCard-dark rounded-lg p-6 shadow-sm">
//                 <h2 className="text-xl font-semibold mb-4">Benefits</h2>
//                 <ul className="list-disc pl-5 space-y-2">
//                   {job.benefits.map((benefit, index) => (
//                     <li
//                       key={index}
//                       className="text-textSecondary dark:text-textSecondary-dark"
//                     >
//                       {benefit}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//         </div>
//       </DashboardLayout>
//     </ProtectedRoute>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Job } from "@/types/jobs";
import { format } from "date-fns";
import {
  FiBriefcase,
  FiMapPin,
  FiDollarSign,
  FiClock,
  FiUser,
  FiArrowLeft,
  FiExternalLink,
} from "react-icons/fi";
import LoadingIndicator from "@/components/ui/Loading";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/laoyout/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getJobDetails, incrementJobViews } from "@/services/job.api";
import JobApplicationButton from "@/components/jobs/JobApplicationButton";

export default function JobDetailsPage() {
  const { jobId } = useParams();
  const router = useRouter();
  const { token, isAuthenticated, isLoading: authLoading } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Check if this is a crawled job
  const isCrawled = job
    ? !!(job as any).isCrawled || !!(job as any).source
    : false;

  useEffect(() => {
    if (!authLoading && isAuthenticated && token && jobId) {
      fetchJobDetails();
    }
  }, [jobId, authLoading, isAuthenticated, token]);

  const fetchJobDetails = async () => {
    if (!token || !jobId) return;

    try {
      setLoading(true);
      const jobData = await getJobDetails(jobId as string, token);
      setJob({
        ...jobData,
        poster:
          jobData.poster ||
          (jobData as any).companyLogo ||
          "/default-poster.png",
        _id: jobData._id || jobId,
      } as Job);

      // Increment view count (only for regular jobs)
      if (!(jobData as any).isCrawled) {
        await incrementJobViews(jobId as string, token);
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

  // Safe date formatting - handles both regular and crawled jobs
  const formatDeadline = () => {
    if (!job) return "No deadline";

    try {
      const deadline =
        job.applicationDeadline ||
        (job as any).expirationDate ||
        (job as any).postedDate;
      if (!deadline) return "No deadline";

      const date = new Date(deadline);
      if (isNaN(date.getTime())) return "No deadline";

      return format(date, "MMM dd, yyyy");
    } catch (error) {
      return "No deadline";
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <LoadingIndicator />
        </div>
      </DashboardLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-bg dark:bg-bg-dark">
        <h2 className="text-2xl font-bold text-text dark:text-text-dark mb-4">
          Please login to view job details
        </h2>
        <p className="text-textSecondary dark:text-textSecondary-dark">
          You need to be logged in to access this page
        </p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-bg dark:bg-bg-dark">
        <h2 className="text-2xl font-bold text-text dark:text-text-dark mb-4">
          {error || "Job not found"}
        </h2>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="min-h-screen bg-bg dark:bg-bg-dark">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="flex items-center text-textSecondary dark:text-textSecondary-dark 
                       hover:text-primary mb-6 transition-colors duration-200"
            >
              <FiArrowLeft className="mr-2" />
              Back to Jobs
            </button>

            {/* Crawled Job Alert */}
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

            {/* Job Header */}
            <div className="bg-white dark:bg-bgCard-dark rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-6">
                {/* Company Logo */}
                <div className="flex-shrink-0">
                  {!imageError ? (
                    <img
                      src={
                        job.poster ||
                        (job as any).companyLogo ||
                        "/company-placeholder.png"
                      }
                      alt={`${
                        job.company?.name ||
                        (job as any).companyName ||
                        "Company"
                      } logo`}
                      className="w-16 h-16 rounded-lg object-cover bg-bgSecondary dark:bg-bgSecondary-dark"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div
                      className="w-16 h-16 rounded-lg bg-bgSecondary dark:bg-bgSecondary-dark
                            flex items-center justify-center"
                    >
                      <FiBriefcase className="w-8 h-8 text-textMuted dark:text-textMuted-dark" />
                    </div>
                  )}
                </div>

                {/* Job Title and Company */}
                <div className="flex-grow">
                  <h1 className="text-2xl font-bold text-text dark:text-text-dark">
                    {job.title}
                  </h1>
                  <p className="text-lg text-textSecondary dark:text-textSecondary-dark mt-1">
                    {job.company?.name ||
                      (job as any).companyName ||
                      "Company Name"}
                  </p>
                  {(job.subtitle || job.description) && (
                    <p className="text-textMuted dark:text-textMuted-dark mt-2 line-clamp-2">
                      {job.subtitle || job.description?.substring(0, 150)}
                    </p>
                  )}
                </div>
              </div>

              {/* Job Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="flex items-center">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-textMuted dark:text-textMuted-dark">
                      Job Type
                    </p>
                    <div className="flex items-center">
                      <FiBriefcase className="w-4 h-4 mr-2 text-textMuted dark:text-textMuted-dark" />
                      <span className="text-sm text-textSecondary dark:text-textSecondary-dark">
                        {job.jobType || "Full-time"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-textMuted dark:text-textMuted-dark">
                      Location
                    </p>
                    <div className="flex items-center">
                      <FiMapPin className="w-4 h-4 mr-2 text-textMuted dark:text-textMuted-dark" />
                      <span className="text-sm text-textSecondary dark:text-textSecondary-dark">
                        {job.location?.type || "On-site"}
                        {job.location?.city && ` • ${job.location.city}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-textMuted dark:text-textMuted-dark">
                      Experience level
                    </p>
                    <div className="flex items-center">
                      <FiUser className="w-4 h-4 mr-2 text-textMuted dark:text-textMuted-dark" />
                      <span className="text-sm text-textSecondary dark:text-textSecondary-dark">
                        {job.experienceLevel || "Any"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-textMuted dark:text-textMuted-dark">
                      {isCrawled ? "Posted Date" : "Application Deadline"}
                    </p>
                    <div className="flex items-center">
                      <FiClock className="w-4 h-4 mr-2 text-textMuted dark:text-textMuted-dark" />
                      <span className="text-sm text-textSecondary dark:text-textSecondary-dark">
                        {formatDeadline()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Salary */}
              <div className="mt-6 flex items-center">
                <FiDollarSign className="w-5 h-5 mr-2 text-success" />
                <span className="text-success font-medium">
                  {formatSalary(job.salary)}
                </span>
              </div>
            </div>

            {/* Application Button */}
            {isCrawled ? (
              <a
                href={(job as any).externalUrl || (job as any).applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full inline-flex items-center justify-center gap-2
                         bg-primary hover:bg-primary-dark text-white font-semibold
                         py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Apply on {(job as any).source || "External Site"}
                <FiExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <JobApplicationButton
                jobId={Array.isArray(jobId) ? jobId[0] : jobId || ""}
                deadline={job.applicationDeadline}
                className="mt-6"
              />
            )}

            {/* Job Description */}
            <div className="mt-6 bg-white dark:bg-bgCard-dark rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                {job.description}
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="mt-6 bg-white dark:bg-bgCard-dark rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {job.requirements.map((req, index) => (
                    <li
                      key={index}
                      className="text-textSecondary dark:text-textSecondary-dark"
                    >
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Technical Requirements */}
            {((job.technicalRequirements &&
              job.technicalRequirements.length > 0) ||
              ((job as any).tags && (job as any).tags.length > 0)) && (
              <div className="mt-6 bg-white dark:bg-bgCard-dark rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">
                  Technical Requirements
                </h2>
                <div className="flex flex-wrap gap-2">
                  {(job.technicalRequirements || (job as any).tags || []).map(
                    (tech: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full
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

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="mt-6 bg-white dark:bg-bgCard-dark rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Benefits</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {job.benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="text-textSecondary dark:text-textSecondary-dark"
                    >
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Company Website (for crawled jobs) */}
            {isCrawled && (job as any).companyUrl && (
              <div className="mt-6 bg-white dark:bg-bgCard-dark rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Company</h2>
                <a
                  href={(job as any).companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-dark flex items-center gap-2"
                >
                  Visit {job.company?.name || (job as any).companyName} website
                  <FiExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
