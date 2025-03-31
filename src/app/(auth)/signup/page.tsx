"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import VerificationCode from "@/components/auth/VerificationCode";
import { Eye, EyeOff } from "lucide-react";
import Toast from "@/components/ui/toast.alert";
import LoadingIndicator from "@/components/ui/Loading";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formTouched, setFormTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [agreed, setAgreed] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Email validation regex pattern
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Add custom styles for dark mode input placeholders
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .dark input::placeholder {
        color: var(--placeholder-color, rgba(209, 213, 219, 0.5));
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Mark field as touched
    setFormTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  // Handle field blur for validation on blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setFormTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  // Validate form fields whenever they change and are touched
  useEffect(() => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    // Only validate fields that have been touched
    if (formTouched.name) {
      if (!formData.name) {
        newErrors.name = "Name is required";
      } else if (formData.name.length < 2) {
        newErrors.name = "Name must be at least 2 characters";
      }
    }

    if (formTouched.email) {
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (formTouched.password) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password =
          "Password must contain at least one uppercase letter";
      } else if (!/[a-z]/.test(formData.password)) {
        newErrors.password =
          "Password must contain at least one lowercase letter";
      } else if (!/[0-9]/.test(formData.password)) {
        newErrors.password = "Password must contain at least one number";
      }
    }

    if (formTouched.confirmPassword) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
  }, [formData, formTouched]);

  // Check if form is valid to enable/disable submit button
  const isFormValid = () => {
    return (
      formData.name &&
      formData.name.length >= 2 &&
      formData.email &&
      emailRegex.test(formData.email) &&
      formData.password &&
      formData.password.length >= 8 &&
      /[A-Z]/.test(formData.password) &&
      /[a-z]/.test(formData.password) &&
      /[0-9]/.test(formData.password) &&
      formData.confirmPassword &&
      formData.confirmPassword === formData.password &&
      agreed &&
      !errors.name &&
      !errors.email &&
      !errors.password &&
      !errors.confirmPassword
    );
  };

  // Validate all fields before submission
  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    let isValid = true;

    if (!formData.name) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
      isValid = false;
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter";
      isValid = false;
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (!agreed) {
      setToast({
        show: true,
        type: "error",
        message: "You must agree to the community guidelines",
      });
      isValid = false;
    }

    setErrors(newErrors);
    setFormTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    return isValid;
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setToast({ show: false, type: "", message: "" });

    // Full validation on submit
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Simulate API call with error handling
    setTimeout(() => {
      try {
        setLoading(false);
        // If successful, show verification code input
        setShowVerification(true);
        setToast({
          show: true,
          type: "success",
          message: "Verification code sent to your email!",
        });
      } catch (error) {
        setLoading(false);
        setToast({
          show: true,
          type: "error",
          message: "An error occurred. Please try again.",
        });
        console.error("Signup error:", error);
      }
    }, 1500);
  };

  const handleVerificationComplete = (code: string) => {
    // Code is the 6-digit verification code
    console.log("User entered code:", code);

    // Simulate verifying code
    setLoading(true);

    setTimeout(() => {
      try {
        setLoading(false);
        setToast({
          show: true,
          type: "success",
          message: "Verification successful! Redirecting...",
        });

        // Simulate redirect after successful verification
        setTimeout(() => {
          // In a real app you would use Next.js router:
          // router.push("/dashboard");
          window.location.href = "/dashboard"; // Fallback for demo
        }, 1500);
      } catch (error) {
        setLoading(false);
        setToast({
          show: true,
          type: "error",
          message: "Verification failed. Please try again.",
        });
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg dark:bg-bg-dark text-text dark:text-text-dark">
      {/* Toast notification */}
      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ show: false, type: "", message: "" })}
        />
      )}

      {/* Loading overlay */}
      {loading && <LoadingIndicator />}

      {!showVerification ? (
        <form
          onSubmit={handleSignUp}
          className="bg-bgCard dark:bg-bgCard-dark p-6 rounded shadow-md w-full max-w-sm space-y-4"
          noValidate
        >
          <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

          <div>
            <label htmlFor="name" className="block mb-1 font-medium">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={`w-full p-2 border rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary dark:bg-bgSecondary-dark dark:text-text-dark ${
                errors.name && formTouched.name
                  ? "border-danger focus:border-danger focus:ring-danger/30"
                  : "border-border dark:border-border-dark focus:border-primary"
              }`}
            />
            {errors.name && formTouched.name && (
              <p id="name-error" className="mt-1 text-sm text-danger">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Your email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`w-full p-2 border rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary dark:bg-bgSecondary-dark dark:text-text-dark ${
                errors.email && formTouched.email
                  ? "border-danger focus:border-danger focus:ring-danger/30"
                  : "border-border dark:border-border-dark focus:border-primary"
              }`}
            />
            {errors.email && formTouched.email && (
              <p id="email-error" className="mt-1 text-sm text-danger">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                className={`w-full p-2 border rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary pr-10 dark:bg-bgSecondary-dark dark:text-text-dark ${
                  errors.password && formTouched.password
                    ? "border-danger focus:border-danger focus:ring-danger/30"
                    : "border-border dark:border-border-dark focus:border-primary"
                }`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-textSecondary hover:text-text dark:hover:text-text-dark transition-colors"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && formTouched.password && (
              <p id="password-error" className="mt-1 text-sm text-danger">
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-1 font-medium">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={errors.confirmPassword ? "true" : "false"}
                aria-describedby={
                  errors.confirmPassword ? "confirm-password-error" : undefined
                }
                className={`w-full p-2 border rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary pr-10 dark:bg-bgSecondary-dark dark:text-text-dark ${
                  errors.confirmPassword && formTouched.confirmPassword
                    ? "border-danger focus:border-danger focus:ring-danger/30"
                    : "border-border dark:border-border-dark focus:border-primary"
                }`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-textSecondary hover:text-text dark:hover:text-text-dark transition-colors"
                onClick={toggleConfirmPasswordVisibility}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && formTouched.confirmPassword && (
              <p
                id="confirm-password-error"
                className="mt-1 text-sm text-danger"
              >
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 rounded border-border dark:border-border-dark text-primary focus:ring-primary dark:bg-bgSecondary-dark"
            />
            <label htmlFor="agree" className="text-sm">
              I agree to the community guidelines
            </label>
          </div>

          <button
            type="submit"
            className="w-full p-2 rounded bg-primary hover:bg-primary-dark dark:bg-primary-dark dark:hover:bg-primary text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !isFormValid()}
          >
            Sign Up
          </button>

          <p className="text-sm text-center text-textSecondary dark:text-textSecondary-dark">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary dark:text-primary-dark underline hover:text-primary-dark dark:hover:text-primary transition-colors"
            >
              Login
            </Link>
          </p>
        </form>
      ) : (
        <div className="bg-bgCard dark:bg-bgCard-dark p-6 rounded shadow-md w-full max-w-sm space-y-4 text-center">
          <h2 className="text-2xl font-bold">Enter Verification Code</h2>
          <p className="text-sm text-textSecondary dark:text-textSecondary-dark">
            We sent a 6-digit code to {formData.email}. Enter it below:
          </p>
          <VerificationCode onComplete={handleVerificationComplete} />
        </div>
      )}
    </div>
  );
}
