"use client";

import React, { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

// Define the allowed types for the toast
export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  type?: ToastType;
  message: string;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
  type = "info", // Default value if not provided
  message,
  duration = 5000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return {
          bgColor: "bg-success/10 dark:bg-success/20",
          borderColor: "border-success",
          textColor: "text-success",
          icon: <CheckCircle className="w-5 h-5" />,
        };
      case "error":
        return {
          bgColor: "bg-danger/10 dark:bg-danger/20",
          borderColor: "border-danger",
          textColor: "text-danger",
          icon: <AlertCircle className="w-5 h-5" />,
        };
      case "warning":
        return {
          bgColor: "bg-warning/10 dark:bg-warning/20",
          borderColor: "border-warning",
          textColor: "text-warning",
          icon: <AlertCircle className="w-5 h-5" />,
        };
      case "info":
      default:
        return {
          bgColor: "bg-info/10 dark:bg-info/20",
          borderColor: "border-info",
          textColor: "text-info dark:text-info",
          icon: <Info className="w-5 h-5" />,
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div
        className={`flex items-center min-w-64 max-w-sm p-4 shadow-lg rounded-lg border-l-4 ${styles.bgColor} ${styles.borderColor} transition-all`}
        role="alert"
      >
        <div className={`flex-shrink-0 ${styles.textColor}`}>{styles.icon}</div>
        <div className={`ml-3 mr-2 ${styles.textColor} font-medium`}>
          {message}
        </div>
        <button
          type="button"
          onClick={onClose}
          className={`ml-auto -mx-1.5 -my-1.5 ${
            styles.textColor
          } hover:bg-bgSecondary dark:hover:bg-bgSecondary-dark rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-${
            type === "info" ? "info" : styles.borderColor.replace("border-", "")
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
