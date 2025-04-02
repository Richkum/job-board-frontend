"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import Toast from "@/components/ui/toast.alert";
import LoadingIndicator from "@/components/ui/Loading";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // Import useAuth hook

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth(); // Use the auth context

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // Add custom styles for dark mode input placeholders
  useEffect(() => {
    // Add custom styles for dark mode input placeholders
    const style = document.createElement("style");
    style.textContent = `
      .dark input::placeholder {
        color: rgba(209, 213, 219, 0.5);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    type?: "success" | "error" | "warning" | "info"; // Same as ToastType
    message: string;
  }>({ show: false, message: "" });
  const [loading, setLoading] = useState(false);
  const [formTouched, setFormTouched] = useState({
    email: false,
    password: false,
  });

  // Email validation regex pattern - allows for most valid email formats
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Handle input changes
  const handleChange = (e: { target: { name: any; value: any } }) => {
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
  const handleBlur = (e: { target: { name: any } }) => {
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

  // Validate form fields whenever they change and are touched
  useEffect(() => {
    const newErrors = { email: "", password: "" };

    // Only validate fields that have been touched
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
      }
    }

    setErrors(newErrors);
  }, [formData, formTouched]);

  // Validate all fields before submission
  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

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
    }

    setErrors(newErrors);
    setFormTouched({ email: true, password: true });
    return isValid;
  };

  // Check if form is valid to enable/disable submit button
  const isFormValid = () => {
    return (
      formData.email &&
      formData.password &&
      emailRegex.test(formData.email) &&
      formData.password.length >= 8 &&
      !errors.email &&
      !errors.password
    );
  };

  // Updated handleLogin to use auth context
  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setToast({ show: false, type: "info", message: "" });

    // Full validation on submit
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log("Attempting login with:", formData);

      // Use the login function from auth context
      await login(formData.email, formData.password);

      setToast({
        show: true,
        type: "success",
        message: "Login successful! Redirecting...",
      });

      // No need to redirect here - the login function will handle it
    } catch (error: any) {
      console.error("Login error:", error);
      setToast({
        show: true,
        type: "error",
        message:
          error.message || "Login failed. Please check your credentials.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg dark:bg-bg-dark text-text dark:text-text-dark">
      {/* Toast notification */}
      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ show: false, type: "info", message: "" })}
        />
      )}

      {/* Loading overlay */}
      {loading && <LoadingIndicator />}

      <form
        onSubmit={handleLogin}
        className="bg-bgCard dark:bg-bgCard-dark p-6 rounded shadow-md w-full max-w-sm space-y-4"
        noValidate
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>

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
              className={`w-full p-2 border rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary pr-10 dark:bg-bgSecondary-dark dark:text-text-dark ${
                errors.password && formTouched.password
                  ? "border-danger focus:border-danger focus:ring-danger/30"
                  : "border-border dark:border-border-dark focus:border-primary"
              }`}
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "password-error" : undefined}
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

        <button
          type="submit"
          className="w-full p-2 rounded bg-primary hover:bg-primary-dark dark:bg-primary-dark dark:hover:bg-primary text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || !isFormValid()}
        >
          Login
        </button>

        <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-textSecondary dark:text-textSecondary-dark mt-2 gap-2">
          <Link
            href="/reset-password"
            className="hover:underline text-[13px] hover:text-primary transition-colors"
          >
            Forgot Password?
          </Link>
          <Link
            href="/signup"
            className="hover:underline hover:text-primary text-[13px] transition-colors"
          >
            Don't have an account? Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}
