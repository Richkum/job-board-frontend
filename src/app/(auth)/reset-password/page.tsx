"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import VerificationCode from "@/components/auth/VerificationCode";
import { Eye, EyeOff } from "lucide-react";
import LoadingIndicator from "@/components/ui/Loading";
import Toast from "@/components/ui/toast.alert";

export default function ResetPasswordPage() {
  // Email step state
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Password step state
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Password visibility toggles
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Flow control state
  const [showVerification, setShowVerification] = useState(false);
  const [showNewPasswordFields, setShowNewPasswordFields] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    type?: "success" | "error" | "warning" | "info"; // Same as ToastType
    message: string;
  }>({ show: false, message: "" });

  // Email validation regex
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

  // Validate email
  useEffect(() => {
    if (!emailTouched) return;

    if (!email) {
      setEmailError("Email is required");
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  }, [email, emailTouched]);

  // Validate password
  useEffect(() => {
    if (!passwordTouched) return;

    if (!newPassword) {
      setPasswordError("Password is required");
    } else if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
    } else if (!/[A-Z]/.test(newPassword)) {
      setPasswordError("Password must contain at least one uppercase letter");
    } else if (!/[a-z]/.test(newPassword)) {
      setPasswordError("Password must contain at least one lowercase letter");
    } else if (!/[0-9]/.test(newPassword)) {
      setPasswordError("Password must contain at least one number");
    } else {
      setPasswordError("");
    }
  }, [newPassword, passwordTouched]);

  // Validate confirm password
  useEffect(() => {
    if (!confirmPasswordTouched) return;

    if (!confirmNewPassword) {
      setConfirmPasswordError("Please confirm your password");
    } else if (confirmNewPassword !== newPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  }, [confirmNewPassword, newPassword, confirmPasswordTouched]);

  // Email input handlers
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
  };

  // Password input handlers
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmNewPassword(e.target.value);
  };

  const handleConfirmPasswordBlur = () => {
    setConfirmPasswordTouched(true);
  };

  // Toggle password visibility
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  // Check if email form is valid
  const isEmailFormValid = () => {
    return email && emailRegex.test(email) && !emailError;
  };

  // Check if password form is valid
  const isPasswordFormValid = () => {
    return (
      newPassword &&
      newPassword.length >= 8 &&
      /[A-Z]/.test(newPassword) &&
      /[a-z]/.test(newPassword) &&
      /[0-9]/.test(newPassword) &&
      confirmNewPassword &&
      confirmNewPassword === newPassword &&
      !passwordError &&
      !confirmPasswordError
    );
  };

  // Submit email for reset
  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setToast({ show: false, message: "" });
    setEmailTouched(true);

    if (!isEmailFormValid()) {
      return;
    }

    setLoading(true);

    setTimeout(() => {
      try {
        setLoading(false);
        setShowVerification(true);
        setToast({
          show: true,
          type: "success",
          message: "Verification code sent to your email",
        });
      } catch (error) {
        setLoading(false);
        setToast({
          show: true,
          type: "error",
          message: "Failed to send verification code. Please try again.",
        });
      }
    }, 1500);
  };

  // Handle verification code completion
  const handleVerificationComplete = (code: string) => {
    console.log("Verification code for reset:", code);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setShowVerification(false);
      setShowNewPasswordFields(true);
      setToast({
        show: true,
        type: "success",
        message: "Verification successful! Create your new password",
      });
    }, 1000);
  };

  // Submit new password
  const handleNewPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setToast({ show: false, message: "" });
    setPasswordTouched(true);
    setConfirmPasswordTouched(true);

    if (!isPasswordFormValid()) {
      return;
    }

    setLoading(true);

    setTimeout(() => {
      try {
        setLoading(false);
        setToast({
          show: true,
          type: "success",
          message: "Password reset successful! Redirecting to login...",
        });

        setTimeout(() => {
          // In a real app you would use Next.js router:
          // router.push("/login");
          window.location.href = "/login"; // Fallback for demo
        }, 2000);
      } catch (error) {
        setLoading(false);
        setToast({
          show: true,
          type: "error",
          message: "Failed to reset password. Please try again.",
        });
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-bg dark:bg-bg-dark text-text dark:text-text-dark">
      {/* Toast notification */}
      {toast.show && (
        <Toast
          type={toast.type} // Type is optional (defaults to "info")
          message={toast.message}
          onClose={() => setToast({ show: false, message: "" })}
        />
      )}

      {/* Loading overlay */}
      {loading && <LoadingIndicator />}

      {/* Email form */}
      {!showVerification && !showNewPasswordFields && (
        <form
          onSubmit={handleSubmitEmail}
          className="bg-bgCard dark:bg-bgCard-dark p-6 rounded shadow-md w-full max-w-sm space-y-4"
          noValidate
        >
          <h2 className="text-2xl font-bold mb-4">Reset Password</h2>

          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Email
            </label>
            <input
              id="email"
              className={`w-full p-2 border rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary dark:bg-bgSecondary-dark dark:text-text-dark ${
                emailError && emailTouched
                  ? "border-danger focus:border-danger focus:ring-danger/30"
                  : "border-border dark:border-border-dark focus:border-primary"
              }`}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              aria-invalid={emailError ? "true" : "false"}
              aria-describedby={emailError ? "email-error" : undefined}
            />
            {emailError && emailTouched && (
              <p id="email-error" className="mt-1 text-sm text-danger">
                {emailError}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full p-2 rounded bg-primary hover:bg-primary-dark dark:bg-primary-dark dark:hover:bg-primary text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !isEmailFormValid()}
          >
            Send Verification Code
          </button>

          <div className="text-sm text-textSecondary dark:text-textSecondary-dark mt-2 text-center">
            <Link
              href="/login"
              className="underline hover:text-primary dark:hover:text-primary-dark transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </form>
      )}

      {/* Verification code form */}
      {showVerification && (
        <div className="bg-bgCard dark:bg-bgCard-dark p-6 rounded shadow-md w-full max-w-sm space-y-4 text-center">
          <h2 className="text-2xl font-bold">Verification Code</h2>
          <p className="text-sm text-textSecondary dark:text-textSecondary-dark">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-text dark:text-text-dark">
              {email}
            </span>
            . Enter it below:
          </p>
          <VerificationCode onComplete={handleVerificationComplete} />
          <div className="text-sm text-textSecondary dark:text-textSecondary-dark mt-4">
            <button
              onClick={() => {
                setShowVerification(false);
                setToast({ show: false, message: "" });
              }}
              className="underline hover:text-primary dark:hover:text-primary-dark transition-colors"
            >
              Back to email form
            </button>
          </div>
        </div>
      )}

      {/* New password form */}
      {showNewPasswordFields && (
        <form
          onSubmit={handleNewPasswordSubmit}
          className="bg-bgCard dark:bg-bgCard-dark p-6 rounded shadow-md w-full max-w-sm space-y-4"
          noValidate
        >
          <h2 className="text-2xl font-bold mb-4">Create New Password</h2>

          <div>
            <label htmlFor="newPassword" className="block mb-1 font-medium">
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                className={`w-full p-2 border rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary pr-10 dark:bg-bgSecondary-dark dark:text-text-dark ${
                  passwordError && passwordTouched
                    ? "border-danger focus:border-danger focus:ring-danger/30"
                    : "border-border dark:border-border-dark focus:border-primary"
                }`}
                type={showNewPassword ? "text" : "password"}
                placeholder="New password"
                value={newPassword}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                aria-invalid={passwordError ? "true" : "false"}
                aria-describedby={passwordError ? "password-error" : undefined}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-textSecondary hover:text-text dark:hover:text-text-dark transition-colors"
                onClick={toggleNewPasswordVisibility}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {passwordError && passwordTouched && (
              <p id="password-error" className="mt-1 text-sm text-danger">
                {passwordError}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmNewPassword"
              className="block mb-1 font-medium"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmNewPassword"
                className={`w-full p-2 border rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary pr-10 dark:bg-bgSecondary-dark dark:text-text-dark ${
                  confirmPasswordError && confirmPasswordTouched
                    ? "border-danger focus:border-danger focus:ring-danger/30"
                    : "border-border dark:border-border-dark focus:border-primary"
                }`}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmNewPassword}
                onChange={handleConfirmPasswordChange}
                onBlur={handleConfirmPasswordBlur}
                aria-invalid={confirmPasswordError ? "true" : "false"}
                aria-describedby={
                  confirmPasswordError ? "confirm-password-error" : undefined
                }
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
            {confirmPasswordError && confirmPasswordTouched && (
              <p
                id="confirm-password-error"
                className="mt-1 text-sm text-danger"
              >
                {confirmPasswordError}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full p-2 rounded bg-primary hover:bg-primary-dark dark:bg-primary-dark dark:hover:bg-primary text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !isPasswordFormValid()}
          >
            Reset Password
          </button>

          <div className="text-sm text-textSecondary dark:text-textSecondary-dark mt-2 text-center">
            <button
              type="button"
              onClick={() => {
                setShowNewPasswordFields(false);
                setShowVerification(true);
                setToast({ show: false, message: "" });
              }}
              className="underline hover:text-primary dark:hover:text-primary-dark transition-colors"
            >
              Back to verification
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
