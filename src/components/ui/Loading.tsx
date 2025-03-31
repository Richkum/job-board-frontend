"use client";

import React from "react";

const LoadingIndicator = ({ fullScreen = false }) => {
  return (
    <div
      className={`${
        fullScreen ? "fixed inset-0" : "absolute inset-0"
      } flex items-center justify-center bg-bg/70 dark:bg-bg-dark/80 backdrop-blur-sm z-50`}
    >
      <div className="relative">
        {/* Outer circle */}
        <div className="w-16 h-16 rounded-full border-4 border-primary/30 dark:border-primary-dark/30"></div>

        {/* Inner spinning circle */}
        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-transparent border-t-primary dark:border-t-primary-dark animate-spin"></div>

        {/* Central dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary dark:bg-primary-dark rounded-full"></div>

        {/* Pulsing effect */}
        <div className="absolute inset-0 rounded-full border-4 border-primary/0 dark:border-primary-dark/0 animate-pulse"></div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
