"use client";

import { JobFilterType } from "@/types/jobs";
import { useState } from "react";
import { FiX } from "react-icons/fi";

interface JobFilterSidebarProps {
  onFilter: (filters: JobFilterType) => void;
  className?: string;
  isMobile?: boolean;
  onClose?: () => void;
  activeFilters: Record<string, any>; // Add activeFilters property
}

export default function JobFilterSidebar({
  onFilter,
  className = "",
  isMobile = false,
  onClose,
}: JobFilterSidebarProps) {
  const [filters, setFilters] = useState<JobFilterType>({});

  const jobTypes = [
    { value: "full-time", label: "Full Time" },
    { value: "part-time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "freelance", label: "Freelance" },
    { value: "internship", label: "Internship" },
  ];

  const categories = [
    { value: "programming", label: "Programming" },
    { value: "design", label: "Design" },
    { value: "marketing", label: "Marketing" },
    { value: "sales", label: "Sales" },
    { value: "customer-service", label: "Customer Service" },
    { value: "general-labor", label: "General Labor" },
    { value: "administrative", label: "Administrative" },
    { value: "other", label: "Other" },
  ];

  const experienceLevels = [
    { value: "entry", label: "Entry Level" },
    { value: "junior", label: "Junior" },
    { value: "mid", label: "Mid Level" },
    { value: "senior", label: "Senior" },
    { value: "lead", label: "Lead" },
    { value: "any", label: "Any Level" },
  ];

  const locationTypes = [
    { value: "remote", label: "Remote" },
    { value: "on-site", label: "On-site" },
    { value: "hybrid", label: "Hybrid" },
  ];

  const currencies = [
    { value: "USD", label: "USD" },
    { value: "EUR", label: "EUR" },
    { value: "GBP", label: "GBP" },
    { value: "FCFA", label: "FCFA" },
  ];

  const periods = [
    { value: "hourly", label: "Per Hour" },
    { value: "monthly", label: "Per Month" },
    { value: "yearly", label: "Per Year" },
  ];

  const handleCheckboxChange = (
    category: keyof JobFilterType,
    value: string,
    checked: boolean
  ) => {
    setFilters((prev) => {
      const currentValues = (prev[category] as string[]) || [];
      const newValues = checked
        ? [...currentValues, value]
        : currentValues.filter((v) => v !== value);

      // Always ensure we're sending arrays
      return {
        ...prev,
        [category]: newValues.length > 0 ? newValues : undefined,
      };
    });
  };

  const handleSalaryChange = (
    field: "min" | "max" | "currency" | "period",
    value: string | number
  ) => {
    setFilters((prev) => ({
      ...prev,
      salaryRange: {
        ...prev.salaryRange,
        [field]: value,
      },
    }));
  };

  const applyFilters = () => {
    const formattedFilters = {
      jobTypes: filters.jobTypes?.length ? filters.jobTypes : undefined,
      categories: filters.categories?.length ? filters.categories : undefined,
      experienceLevels: filters.experienceLevels?.length
        ? filters.experienceLevels
        : undefined,
      locationTypes: filters.locationTypes?.length
        ? filters.locationTypes
        : undefined,
      // Convert salary range to individual properties
      salaryMin: filters.salaryRange?.min
        ? Number(filters.salaryRange.min)
        : undefined,
      salaryMax: filters.salaryRange?.max
        ? Number(filters.salaryRange.max)
        : undefined,
      salaryCurrency: filters.salaryRange?.currency || undefined,
      salaryPeriod: filters.salaryRange?.period || undefined,
    };
    onFilter(formattedFilters);

    if (isMobile && onClose) {
      onClose();
    }
  };

  const clearFilters = () => {
    setFilters({});
    onFilter({});
  };

  const FilterSection = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="py-4 border-b border-border dark:border-border-dark last:border-0">
      <h3 className="text-sm font-semibold text-text dark:text-text-dark mb-3">
        {title}
      </h3>
      {children}
    </div>
  );

  const CheckboxGroup = ({
    options,
    category,
    selectedValues = [],
  }: {
    options: { value: string; label: string }[];
    category: keyof JobFilterType;
    selectedValues?: string[];
  }) => (
    <div className="space-y-2">
      {options.map(({ value, label }) => (
        <label
          key={value}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={selectedValues.includes(value)}
            onChange={(e) =>
              handleCheckboxChange(category, value, e.target.checked)
            }
            className="w-4 h-4 rounded border-border dark:border-border-dark
                     text-primary focus:ring-primary"
          />
          <span className="text-sm text-textSecondary dark:text-textSecondary-dark">
            {label}
          </span>
        </label>
      ))}
    </div>
  );

  return (
    <div
      className={`bg-white dark:bg-bgCard-dark rounded-lg border border-border 
                    dark:border-border-dark ${className} ${
        isMobile ? "fixed inset-y-0 right-0 w-64 sm:w-80 z-50 shadow-xl" : ""
      }`}
    >
      <div className="p-4">
        {isMobile && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text dark:text-text-dark">
              Filters
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-bgSecondary dark:hover:bg-bgSecondary-dark
                       text-textSecondary dark:text-textSecondary-dark
                       transition-colors duration-200"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        )}

        <FilterSection title="Job Type">
          <CheckboxGroup
            options={jobTypes}
            category="jobTypes"
            selectedValues={filters.jobTypes}
          />
        </FilterSection>

        <FilterSection title="Category">
          <CheckboxGroup
            options={categories}
            category="categories"
            selectedValues={filters.categories}
          />
        </FilterSection>

        <FilterSection title="Experience Level">
          <CheckboxGroup
            options={experienceLevels}
            category="experienceLevels"
            selectedValues={filters.experienceLevels}
          />
        </FilterSection>

        <FilterSection title="Location Type">
          <CheckboxGroup
            options={locationTypes}
            category="locationTypes"
            selectedValues={filters.locationTypes}
          />
        </FilterSection>

        <FilterSection title="Salary Range">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-textMuted dark:text-textMuted-dark mb-1 block">
                  Min
                </label>
                <input
                  type="number"
                  value={filters.salaryRange?.min || ""}
                  onChange={(e) =>
                    handleSalaryChange("min", Number(e.target.value))
                  }
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border 
                           dark:border-border-dark bg-white dark:bg-bgCard-dark
                           text-text dark:text-text-dark placeholder-textMuted
                           focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs text-textMuted dark:text-textMuted-dark mb-1 block">
                  Max
                </label>
                <input
                  type="number"
                  value={filters.salaryRange?.max || ""}
                  onChange={(e) =>
                    handleSalaryChange("max", Number(e.target.value))
                  }
                  placeholder="No limit"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border 
                           dark:border-border-dark bg-white dark:bg-bgCard-dark
                           text-text dark:text-text-dark placeholder-textMuted
                           focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={filters.salaryRange?.currency || ""}
                onChange={(e) => handleSalaryChange("currency", e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border 
                         dark:border-border-dark bg-white dark:bg-bgCard-dark
                         text-text dark:text-text-dark
                         focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Currency</option>
                {currencies.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>

              <select
                value={filters.salaryRange?.period || ""}
                onChange={(e) => handleSalaryChange("period", e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border 
                         dark:border-border-dark bg-white dark:bg-bgCard-dark
                         text-text dark:text-text-dark
                         focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Period</option>
                {periods.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </FilterSection>

        <div className="pt-4 space-x-3 flex">
          <button
            onClick={clearFilters}
            className="flex-1 px-4 py-2 text-sm rounded-lg border border-border 
                     dark:border-border-dark text-textSecondary dark:text-textSecondary-dark
                     hover:bg-bgSecondary dark:hover:bg-bgSecondary-dark
                     transition-colors duration-200"
          >
            Clear All
          </button>
          <button
            onClick={applyFilters}
            className="flex-1 px-4 py-2 text-sm rounded-lg bg-primary text-white
                     hover:bg-primary-dark transition-colors duration-200"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
