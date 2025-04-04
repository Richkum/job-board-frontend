"use client";

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { FiChevronDown } from "react-icons/fi";
import { JobSortBy } from "@/services/job.api";

interface JobSortProps {
  sortBy: JobSortBy;
  onSort: (sort: JobSortBy) => void;
}

const sortOptions = [
  { value: JobSortBy.NEWEST, label: "Newest First" },
  { value: JobSortBy.SALARY_HIGH, label: "Highest Salary" },
  { value: JobSortBy.SALARY_LOW, label: "Lowest Salary" },
  { value: JobSortBy.MOST_VIEWED, label: "Most Viewed" },
  { value: JobSortBy.DEADLINE_CLOSEST, label: "Deadline Closest" },
];

export default function JobSort({ sortBy, onSort }: JobSortProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-textSecondary dark:text-textSecondary-dark bg-bgCard dark:bg-bgCard-dark border border-border dark:border-border-dark rounded-md hover:bg-bgSecondary dark:hover:bg-bgSecondary-dark transition-colors duration-200">
        Sort by: {sortOptions.find((opt) => opt.value === sortBy)?.label}
        <FiChevronDown className="h-4 w-4" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-bgCard dark:bg-bgCard-dark border border-border dark:border-border-dark shadow-lg focus:outline-none z-10">
          <div className="py-1">
            {sortOptions.map((option) => (
              <Menu.Item key={option.value}>
                {({ active }) => (
                  <button
                    onClick={() => onSort(option.value)}
                    className={`${
                      active
                        ? "bg-primary/5 text-primary"
                        : "text-text dark:text-text-dark"
                    } ${
                      sortBy === option.value
                        ? "bg-primary/10 text-primary"
                        : ""
                    } group flex w-full items-center px-4 py-2 text-sm`}
                  >
                    {option.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
