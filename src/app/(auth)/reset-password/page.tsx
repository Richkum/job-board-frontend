"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import VerificationCode from "@/components/auth/VerificationCode";
import { Eye, EyeOff } from "lucide-react";
import LoadingIndicator from "@/components/ui/Loading";
import Toast from "@/components/ui/toast.alert";

export default function ResetPasswordPage() {
  //get the API URL from the environment variable
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

  // Verification code
  const [verificationCode, setVerificationCode] = useState("");

  // Password visibility toggles
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Flow control state
  const [showVerification, setShowVerification] = useState(false);
  const [showNewPasswordFields, setShowNewPasswordFields] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    type?: "success" | "error" | "warning" | "info";
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

  // Simplified password validation
  useEffect(() => {
    if (!passwordTouched) return;

    if (!newPassword) {
      setPasswordError("Password is required");
    } else if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
    } else {
      setPasswordError("");
    }
  }, [newPassword, passwordTouched]);

  // Simplified confirm password validation
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

  // Input handlers
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
  };

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

  // Form validation
  const isEmailFormValid = () => {
    return email && emailRegex.test(email);
  };

  const isPasswordFormValid = () => {
    return (
      newPassword &&
      newPassword.length >= 8 &&
      confirmNewPassword &&
      confirmNewPassword === newPassword
    );
  };

  // Submit email for reset
  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast({ show: false, message: "" });
    setEmailTouched(true);

    if (!isEmailFormValid()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      setLoading(false);

      if (response.ok) {
        setShowVerification(true);
        setToast({
          show: true,
          type: "success",
          message: "Verification code sent to your email",
        });
      } else {
        setToast({
          show: true,
          type: "error",
          message: data.message || "Failed to send verification code",
        });
      }
    } catch (error) {
      setLoading(false);
      setToast({
        show: true,
        type: "error",
        message: "Failed to send verification code. Please try again.",
      });
    }
  };

  // Handle verification code completion
  const handleVerificationComplete = (code: string) => {
    setVerificationCode(code);
    setLoading(true);

    // We don't verify the code yet, just move to the next step
    // The verification will happen when submitting the new password
    setTimeout(() => {
      setLoading(false);
      setShowVerification(false);
      setShowNewPasswordFields(true);
      setToast({
        show: true,
        type: "success",
        message: "Create your new password",
      });
    }, 500);
  };

  // Submit new password
  const handleNewPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast({ show: false, message: "" });
    setPasswordTouched(true);
    setConfirmPasswordTouched(true);

    if (!isPasswordFormValid()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            code: verificationCode,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      setLoading(false);

      if (response.ok) {
        setToast({
          show: true,
          type: "success",
          message: "Password reset successful! Redirecting to login...",
        });

        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setToast({
          show: true,
          type: "error",
          message: data.message || "Failed to reset password",
        });
      }
    } catch (error) {
      setLoading(false);
      setToast({
        show: true,
        type: "error",
        message: "Failed to reset password. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-bg dark:bg-bg-dark text-text dark:text-text-dark">
      {/* Toast notification */}
      {toast.show && (
        <Toast
          type={toast.type}
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
