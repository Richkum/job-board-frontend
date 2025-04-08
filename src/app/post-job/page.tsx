// "use client";

// import { useState, useRef } from "react";
// import LoadingIndicator from "@/components/ui/Loading";
// import Toast from "@/components/ui/toast.alert";
// import { useAuth } from "@/context/AuthContext";
// import Image from "next/image";
// import DashboardLayout from "@/components/laoyout/DashboardLayout";
// import { createJob } from "@/services/job.api";
// import { X } from "lucide-react";

// interface ToastState {
//   show: boolean;
//   message: string;
//   type: "success" | "error" | "info" | "warning";
// }

// export default function PostJobPage() {
//   const { token } = useAuth();
//   const [isLoading, setIsLoading] = useState(false);
//   const [toast, setToast] = useState<ToastState>({
//     show: false,
//     message: "",
//     type: "info",
//   });
//   const [poster, setPoster] = useState<File | null>(null);
//   const [posterPreview, setPosterPreview] = useState<string>("");
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Form state
//   const [formData, setFormData] = useState({
//     title: "",
//     subtitle: "",
//     jobType: "full-time",
//     category: "programming",
//     requirements: [""],
//     technicalRequirements: [""],
//     description: "",
//     salary: {
//       range: {
//         min: undefined as number | undefined,
//         max: undefined as number | undefined,
//       },
//       currency: "USD",
//       period: "yearly",
//       isNegotiable: true,
//     },
//     location: {
//       type: "remote",
//       country: "",
//       city: "",
//       address: "",
//     },
//     applicationDeadline: "",
//     experienceLevel: "any",
//     benefits: [""],
//   });

//   // Handle image upload
//   const handlePosterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setPoster(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPosterPreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle array fields (requirements, technical requirements, benefits)
//   const handleArrayFieldChange = (
//     field: "requirements" | "technicalRequirements" | "benefits",
//     index: number,
//     value: string
//   ) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: prev[field].map((item, i) => (i === index ? value : item)),
//     }));
//   };

//   const addArrayField = (
//     field: "requirements" | "technicalRequirements" | "benefits"
//   ) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: [...prev[field], ""],
//     }));
//   };

//   const removeArrayField = (
//     field: "requirements" | "technicalRequirements" | "benefits",
//     index: number
//   ) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: prev[field].filter((_, i) => i !== index),
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       await createJob(
//         {
//           ...formData,
//           applicationDeadline: new Date(formData.applicationDeadline),
//         },
//         poster,
//         token!
//       );
//       setToast({
//         show: true,
//         message: "Job posted successfully!",
//         type: "success",
//       });
//       // Reset form or redirect
//     } catch (error: any) {
//       setToast({
//         show: true,
//         message: error.message || "Failed to post job",
//         type: "error",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Check if form is valid
//   const isFormValid = () => {
//     const requiredFields = [
//       formData.title,
//       formData.subtitle,
//       formData.description,
//       formData.requirements.length > 0 && formData.requirements[0] !== "",
//       formData.applicationDeadline,
//     ];
//     return requiredFields.every(Boolean);
//   };

//   return (
//     <DashboardLayout>
//       <div className="max-w-4xl mx-auto p-6">
//         <h1 className="text-2xl font-bold text-text dark:text-text-dark mb-6">
//           Post a New Job
//         </h1>

//         {toast.show && (
//           <Toast
//             type={toast.type}
//             message={toast.message}
//             onClose={() => setToast({ ...toast, show: false })}
//           />
//         )}

//         {/* Move LoadingIndicator here, outside of the content div */}
//         {isLoading && <LoadingIndicator />}

//         <form onSubmit={handleSubmit} className="space-y-8">
//           {/* Basic Job Information */}
//           <section className="bg-bgCard dark:bg-bgCard-dark p-6 rounded-lg shadow-sm">
//             <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

//             <div className="space-y-4">
//               {/* Job Title */}
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Job Title <span className="text-danger">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.title}
//                   onChange={(e) =>
//                     setFormData({ ...formData, title: e.target.value })
//                   }
//                   className="w-full p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
//                   required
//                 />
//               </div>

//               {/* Job Subtitle */}
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Short Description <span className="text-danger">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.subtitle}
//                   onChange={(e) =>
//                     setFormData({ ...formData, subtitle: e.target.value })
//                   }
//                   className="w-full p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
//                   required
//                 />
//               </div>

//               {/* Job Type & Category */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Job Type <span className="text-danger">*</span>
//                   </label>
//                   <select
//                     value={formData.jobType}
//                     onChange={(e) =>
//                       setFormData({ ...formData, jobType: e.target.value })
//                     }
//                     className="w-full p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
//                     required
//                   >
//                     <option value="full-time">Full Time</option>
//                     <option value="part-time">Part Time</option>
//                     <option value="contract">Contract</option>
//                     <option value="freelance">Freelance</option>
//                     <option value="internship">Internship</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Category <span className="text-danger">*</span>
//                   </label>
//                   <select
//                     value={formData.category}
//                     onChange={(e) =>
//                       setFormData({ ...formData, category: e.target.value })
//                     }
//                     className="w-full p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
//                     required
//                   >
//                     <option value="programming">Programming</option>
//                     <option value="design">Design</option>
//                     <option value="marketing">Marketing</option>
//                     <option value="sales">Sales</option>
//                     <option value="customer-service">Customer Service</option>
//                     <option value="general-labor">General Labor</option>
//                     <option value="administrative">Administrative</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Requirements */}
//           <section className="bg-bgCard dark:bg-bgCard-dark p-6 rounded-lg shadow-sm">
//             <h2 className="text-xl font-semibold mb-4">Requirements</h2>

//             {/* Job Requirements */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium mb-2">
//                 Job Requirements <span className="text-danger">*</span>
//               </label>
//               {formData.requirements.map((req, index) => (
//                 <div key={index} className="flex gap-2 mb-2">
//                   <input
//                     type="text"
//                     value={req}
//                     onChange={(e) =>
//                       handleArrayFieldChange(
//                         "requirements",
//                         index,
//                         e.target.value
//                       )
//                     }
//                     className="flex-1 p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
//                     placeholder="Enter requirement"
//                     required={index === 0}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeArrayField("requirements", index)}
//                     className="px-3 py-2 text-danger hover:bg-danger/10 rounded-md"
//                     disabled={index === 0 && formData.requirements.length === 1}
//                   >
//                     Remove
//                   </button>
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 onClick={() => addArrayField("requirements")}
//                 className="mt-2 text-primary dark:text-primary-dark hover:underline"
//               >
//                 + Add Requirement
//               </button>
//             </div>

//             {/* Technical Requirements (Optional) */}
//             <div>
//               <label className="block text-sm font-medium mb-2">
//                 Technical Requirements (Optional)
//               </label>
//               {formData.technicalRequirements.map((req, index) => (
//                 <div key={index} className="flex gap-2 mb-2">
//                   <input
//                     type="text"
//                     value={req}
//                     onChange={(e) =>
//                       handleArrayFieldChange(
//                         "technicalRequirements",
//                         index,
//                         e.target.value
//                       )
//                     }
//                     className="flex-1 p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
//                     placeholder="Enter technical requirement"
//                   />
//                   <button
//                     type="button"
//                     onClick={() =>
//                       removeArrayField("technicalRequirements", index)
//                     }
//                     className="px-3 py-2 text-danger hover:bg-danger/10 rounded-md"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 onClick={() => addArrayField("technicalRequirements")}
//                 className="mt-2 text-primary dark:text-primary-dark hover:underline"
//               >
//                 + Add Technical Requirement
//               </button>
//             </div>
//           </section>

//           {/* Salary & Benefits */}
//           <section className="bg-bgCard dark:bg-bgCard-dark p-6 rounded-lg shadow-sm">
//             <h2 className="text-xl font-semibold mb-4">Salary & Benefits</h2>

//             {/* Salary Range */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Minimum Salary (Optional)
//                 </label>
//                 <input
//                   type="number"
//                   value={formData.salary.range.min || ""}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       salary: {
//                         ...formData.salary,
//                         range: {
//                           ...formData.salary.range,
//                           min: e.target.value
//                             ? Number(e.target.value)
//                             : undefined,
//                         },
//                       },
//                     })
//                   }
//                   className="w-full p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Maximum Salary (Optional)
//                 </label>
//                 <input
//                   type="number"
//                   value={formData.salary.range.max || ""}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       salary: {
//                         ...formData.salary,
//                         range: {
//                           ...formData.salary.range,
//                           max: e.target.value
//                             ? Number(e.target.value)
//                             : undefined,
//                         },
//                       },
//                     })
//                   }
//                   className="w-full p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
//                 />
//               </div>
//             </div>

//             {/* Salary Details */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Currency
//                 </label>
//                 <select
//                   value={formData.salary.currency}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       salary: { ...formData.salary, currency: e.target.value },
//                     })
//                   }
//                   className="w-full p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
//                 >
//                   <option value="USD">USD</option>
//                   <option value="EUR">EUR</option>
//                   <option value="GBP">GBP</option>
//                   <option value="FCFA">FCFA</option>
//                   {/* Add more currencies as needed */}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Period</label>
//                 <select
//                   value={formData.salary.period}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       salary: { ...formData.salary, period: e.target.value },
//                     })
//                   }
//                   className="w-full p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
//                 >
//                   <option value="hourly">Hourly</option>
//                   <option value="monthly">Monthly</option>
//                   <option value="yearly">Yearly</option>
//                 </select>
//               </div>

//               <div className="flex items-center">
//                 <label className="flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={formData.salary.isNegotiable}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         salary: {
//                           ...formData.salary,
//                           isNegotiable: e.target.checked,
//                         },
//                       })
//                     }
//                     className="mr-2"
//                   />
//                   <span className="text-sm">Salary Negotiable</span>
//                 </label>
//               </div>
//             </div>

//             {/* Benefits */}
//             <div>
//               <label className="block text-sm font-medium mb-2">
//                 Benefits (Optional)
//               </label>
//               {formData.benefits.map((benefit, index) => (
//                 <div key={index} className="flex gap-2 mb-2">
//                   <input
//                     type="text"
//                     value={benefit}
//                     onChange={(e) =>
//                       handleArrayFieldChange("benefits", index, e.target.value)
//                     }
//                     className="flex-1 p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
//                     placeholder="Enter benefit"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeArrayField("benefits", index)}
//                     className="px-3 py-2 text-danger hover:bg-danger/10 rounded-md"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 onClick={() => addArrayField("benefits")}
//                 className="mt-2 text-primary dark:text-primary-dark hover:underline"
//               >
//                 + Add Benefit
//               </button>
//             </div>
//           </section>

//           {/* Location & Work Type */}
//           <section className="bg-bgCard dark:bg-bgCard-dark p-6 rounded-lg shadow-sm">
//             <h2 className="text-xl font-semibold mb-4">Location & Work Type</h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Work Type <span className="text-danger">*</span>
//                 </label>
//                 <select
//                   value={formData.location.type}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       location: { ...formData.location, type: e.target.value },
//                     })
//                   }
//                   className="w-full p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
//                   required
//                 >
//                   <option value="remote">Remote</option>
//                   <option value="on-site">On-site</option>
//                   <option value="hybrid">Hybrid</option>
//                 </select>
//               </div>

//               {(formData.location.type === "on-site" ||
//                 formData.location.type === "hybrid") && (
//                 <>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">
//                       Country
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.location.country}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           location: {
//                             ...formData.location,
//                             country: e.target.value,
//                           },
//                         })
//                       }
//                       className="w-full p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">
//                       City
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.location.city}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           location: {
//                             ...formData.location,
//                             city: e.target.value,
//                           },
//                         })
//                       }
//                       className="w-full p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">
//                       Address
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.location.address}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           location: {
//                             ...formData.location,
//                             address: e.target.value,
//                           },
//                         })
//                       }
//                       className="w-full p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
//                     />
//                   </div>
//                 </>
//               )}
//             </div>
//           </section>

//           {/* Job Description & Details */}
//           <section className="bg-bgCard dark:bg-bgCard-dark p-6 rounded-lg shadow-sm">
//             <h2 className="text-xl font-semibold mb-4">
//               Job Description & Details
//             </h2>

//             {/* Description */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium mb-1">
//                 Job Description <span className="text-danger">*</span>
//               </label>
//               <textarea
//                 value={formData.description}
//                 onChange={(e) =>
//                   setFormData({ ...formData, description: e.target.value })
//                 }
//                 className="w-full p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark min-h-[200px]"
//                 required
//               />
//             </div>

//             {/* Experience Level */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium mb-1">
//                 Experience Level <span className="text-danger">*</span>
//               </label>
//               <select
//                 value={formData.experienceLevel}
//                 onChange={(e) =>
//                   setFormData({ ...formData, experienceLevel: e.target.value })
//                 }
//                 className="w-full p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
//                 required
//               >
//                 <option value="entry">Entry Level</option>
//                 <option value="junior">Junior</option>
//                 <option value="mid">Mid Level</option>
//                 <option value="senior">Senior</option>
//                 <option value="lead">Lead</option>
//                 <option value="any">Any Level</option>
//               </select>
//             </div>

//             {/* Application Deadline */}
//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Application Deadline <span className="text-danger">*</span>
//               </label>
//               <input
//                 type="date"
//                 value={formData.applicationDeadline}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     applicationDeadline: e.target.value,
//                   })
//                 }
//                 min={new Date().toISOString().split("T")[0]}
//                 className="w-full p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
//                 required
//               />
//             </div>
//           </section>

//           {/* Job Poster */}
//           <section className="bg-bgCard dark:bg-bgCard-dark p-6 rounded-lg shadow-sm">
//             <h2 className="text-xl font-semibold mb-4">
//               Job Poster (Optional)
//             </h2>

//             <div className="space-y-4">
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handlePosterChange}
//                 accept="image/*"
//                 className="hidden"
//               />

//               <button
//                 type="button"
//                 onClick={() => fileInputRef.current?.click()}
//                 className="px-4 py-2 border border-border dark:border-border-dark rounded-md hover:bg-bgSecondary dark:hover:bg-bgSecondary-dark transition-colors"
//               >
//                 Choose Image
//               </button>

//               {posterPreview && (
//                 <div className="relative w-full max-w-md">
//                   <img
//                     src={posterPreview}
//                     alt="Job poster preview"
//                     className="w-full h-auto rounded-lg"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setPoster(null);
//                       setPosterPreview("");
//                     }}
//                     className="absolute top-2 right-2 p-1 bg-danger rounded-full text-white hover:bg-danger/80"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 </div>
//               )}
//             </div>
//           </section>

//           {/* Submit Button */}
//           <div className="flex justify-end">
//             <button
//               type="submit"
//               disabled={!isFormValid()}
//               className={`px-6 py-2 rounded-md text-white ${
//                 isFormValid()
//                   ? "bg-primary hover:bg-primary-dark"
//                   : "bg-primary/50 cursor-not-allowed"
//               }`}
//             >
//               Post Job
//             </button>
//           </div>
//         </form>
//       </div>
//     </DashboardLayout>
//   );
// }

"use client";

import { useState, useRef, useEffect } from "react";
import LoadingIndicator from "@/components/ui/Loading";
import Toast from "@/components/ui/toast.alert";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import DashboardLayout from "@/components/laoyout/DashboardLayout";
import { createJob } from "@/services/job.api";
import { X } from "lucide-react";

interface ToastState {
  show: boolean;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

// Initial form state to reuse for resetting the form
const initialFormState = {
  title: "",
  subtitle: "",
  jobType: "full-time",
  category: "programming",
  requirements: [""],
  technicalRequirements: [""],
  description: "",
  salary: {
    range: {
      min: undefined as number | undefined,
      max: undefined as number | undefined,
    },
    currency: "USD",
    period: "yearly",
    isNegotiable: true,
  },
  location: {
    type: "remote",
    country: "",
    city: "",
    address: "",
  },
  applicationDeadline: "",
  experienceLevel: "any",
  benefits: [""],
};

export default function PostJobPage() {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "info",
  });
  const [poster, setPoster] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState(initialFormState);

  // Handle image upload
  const handlePosterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPoster(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle array fields (requirements, technical requirements, benefits)
  const handleArrayFieldChange = (
    field: "requirements" | "technicalRequirements" | "benefits",
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayField = (
    field: "requirements" | "technicalRequirements" | "benefits"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayField = (
    field: "requirements" | "technicalRequirements" | "benefits",
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // Function to reset the form
  const resetForm = () => {
    setFormData(initialFormState);
    setPoster(null);
    setPosterPreview("");
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createJob(
        {
          ...formData,
          applicationDeadline: new Date(formData.applicationDeadline),
        } as any, // Use type assertion to bypass the error
        poster as any, // Use type assertion to bypass the error
        token! // Non-null assertion
      );
      setToast({
        show: true,
        message: "Job posted successfully!",
        type: "success",
      });

      // Reset form after successful submission
      resetForm();
    } catch (error: any) {
      setToast({
        show: true,
        message: error.message || "Failed to post job",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    const requiredFields = [
      formData.title,
      formData.subtitle,
      formData.description,
      formData.requirements.length > 0 && formData.requirements[0] !== "",
      formData.applicationDeadline,
    ];
    return requiredFields.every(Boolean);
  };

  return (
    <DashboardLayout>
      {/* Move LoadingIndicator outside the content div to position it properly */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <LoadingIndicator />
        </div>
      )}

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-text dark:text-text-dark mb-6">
          Post a New Job
        </h1>

        {toast.show && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Job Information */}
          <section className="bg-bgCard dark:bg-bgCard-dark p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

            <div className="space-y-4">
              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Job Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
                  required
                />
              </div>

              {/* Job Subtitle */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Short Description <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                  className="w-full p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
                  required
                />
              </div>

              {/* Job Type & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Job Type <span className="text-danger">*</span>
                  </label>
                  <select
                    value={formData.jobType}
                    onChange={(e) =>
                      setFormData({ ...formData, jobType: e.target.value })
                    }
                    className="w-full p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
                    required
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category <span className="text-danger">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
                    required
                  >
                    <option value="programming">Programming</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                    <option value="sales">Sales</option>
                    <option value="customer-service">Customer Service</option>
                    <option value="general-labor">General Labor</option>
                    <option value="administrative">Administrative</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Requirements */}
          <section className="bg-bgCard dark:bg-bgCard-dark p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Requirements</h2>

            {/* Job Requirements */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Job Requirements <span className="text-danger">*</span>
              </label>
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) =>
                      handleArrayFieldChange(
                        "requirements",
                        index,
                        e.target.value
                      )
                    }
                    className="flex-1 p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
                    placeholder="Enter requirement"
                    required={index === 0}
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayField("requirements", index)}
                    className="px-3 py-2 text-danger hover:bg-danger/10 rounded-md"
                    disabled={index === 0 && formData.requirements.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField("requirements")}
                className="mt-2 text-primary dark:text-primary-dark hover:underline"
              >
                + Add Requirement
              </button>
            </div>

            {/* Technical Requirements (Optional) */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Technical Requirements (Optional)
              </label>
              {formData.technicalRequirements.map((req, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) =>
                      handleArrayFieldChange(
                        "technicalRequirements",
                        index,
                        e.target.value
                      )
                    }
                    className="flex-1 p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
                    placeholder="Enter technical requirement"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      removeArrayField("technicalRequirements", index)
                    }
                    className="px-3 py-2 text-danger hover:bg-danger/10 rounded-md"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField("technicalRequirements")}
                className="mt-2 text-primary dark:text-primary-dark hover:underline"
              >
                + Add Technical Requirement
              </button>
            </div>
          </section>

          {/* Salary & Benefits */}
          <section className="bg-bgCard dark:bg-bgCard-dark p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Salary & Benefits</h2>

            {/* Salary Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Minimum Salary (Optional)
                </label>
                <input
                  type="number"
                  value={formData.salary.range.min || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      salary: {
                        ...formData.salary,
                        range: {
                          ...formData.salary.range,
                          min: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        },
                      },
                    })
                  }
                  className="w-full p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Maximum Salary (Optional)
                </label>
                <input
                  type="number"
                  value={formData.salary.range.max || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      salary: {
                        ...formData.salary,
                        range: {
                          ...formData.salary.range,
                          max: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        },
                      },
                    })
                  }
                  className="w-full p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
                />
              </div>
            </div>

            {/* Salary Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Currency
                </label>
                <select
                  value={formData.salary.currency}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      salary: { ...formData.salary, currency: e.target.value },
                    })
                  }
                  className="w-full p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="FCFA">FCFA</option>
                  {/* Add more currencies as needed */}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Period</label>
                <select
                  value={formData.salary.period}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      salary: { ...formData.salary, period: e.target.value },
                    })
                  }
                  className="w-full p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
                >
                  <option value="hourly">Hourly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.salary.isNegotiable}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        salary: {
                          ...formData.salary,
                          isNegotiable: e.target.checked,
                        },
                      })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">Salary Negotiable</span>
                </label>
              </div>
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Benefits (Optional)
              </label>
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) =>
                      handleArrayFieldChange("benefits", index, e.target.value)
                    }
                    className="flex-1 p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
                    placeholder="Enter benefit"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayField("benefits", index)}
                    className="px-3 py-2 text-danger hover:bg-danger/10 rounded-md"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField("benefits")}
                className="mt-2 text-primary dark:text-primary-dark hover:underline"
              >
                + Add Benefit
              </button>
            </div>
          </section>

          {/* Location & Work Type */}
          <section className="bg-bgCard dark:bg-bgCard-dark p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Location & Work Type</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Work Type <span className="text-danger">*</span>
                </label>
                <select
                  value={formData.location.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, type: e.target.value },
                    })
                  }
                  className="w-full p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
                  required
                >
                  <option value="remote">Remote</option>
                  <option value="on-site">On-site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              {(formData.location.type === "on-site" ||
                formData.location.type === "hybrid") && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={formData.location.country}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location: {
                            ...formData.location,
                            country: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.location.city}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location: {
                            ...formData.location,
                            city: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={formData.location.address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location: {
                            ...formData.location,
                            address: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
                    />
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Job Description & Details */}
          <section className="bg-bgCard dark:bg-bgCard-dark p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              Job Description & Details
            </h2>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                Job Description <span className="text-danger">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark min-h-[200px]"
                required
              />
            </div>

            {/* Experience Level */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                Experience Level <span className="text-danger">*</span>
              </label>
              <select
                value={formData.experienceLevel}
                onChange={(e) =>
                  setFormData({ ...formData, experienceLevel: e.target.value })
                }
                className="w-full p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
                required
              >
                <option value="entry">Entry Level</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
                <option value="any">Any Level</option>
              </select>
            </div>

            {/* Application Deadline */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Application Deadline <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                value={formData.applicationDeadline}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    applicationDeadline: e.target.value,
                  })
                }
                min={new Date().toISOString().split("T")[0]}
                className="w-full p-2 border border-border dark:border-border-dark rounded-md bg-bg dark:bg-bg-dark"
                required
              />
            </div>
          </section>

          {/* Job Poster */}
          <section className="bg-bgCard dark:bg-bgCard-dark p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              Job Poster (Optional)
            </h2>

            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePosterChange}
                accept="image/*"
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 border border-border dark:border-border-dark rounded-md hover:bg-bgSecondary dark:hover:bg-bgSecondary-dark transition-colors"
              >
                Choose Image
              </button>

              {posterPreview && (
                <div className="relative w-full max-w-md">
                  <img
                    src={posterPreview}
                    alt="Job poster preview"
                    className="w-full h-auto rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPoster(null);
                      setPosterPreview("");
                    }}
                    className="absolute top-2 right-2 p-1 bg-danger rounded-full text-white hover:bg-danger/80"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 rounded-md border border-primary text-primary hover:bg-primary/10"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={!isFormValid() || isLoading}
              className={`px-6 py-2 rounded-md text-white ${
                isFormValid() && !isLoading
                  ? "bg-primary hover:bg-primary-dark"
                  : "bg-primary/50 cursor-not-allowed"
              }`}
            >
              {isLoading ? "Posting..." : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
