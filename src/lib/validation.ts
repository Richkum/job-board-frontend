/**
 * Validates an email address
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a password with the following rules:
 * - At least 8 characters
 * - Contains at least one uppercase letter
 * - Contains at least one lowercase letter
 * - Contains at least one number
 */
export const validatePassword = (password: string): boolean => {
  // Check length
  if (password.length < 8) return false;

  // Check for uppercase
  if (!/[A-Z]/.test(password)) return false;

  // Check for lowercase
  if (!/[a-z]/.test(password)) return false;

  // Check for number
  if (!/[0-9]/.test(password)) return false;

  return true;
};

/**
 * Validates that two passwords match
 */
export const passwordsMatch = (
  password: string,
  confirmPassword: string
): boolean => {
  return password === confirmPassword;
};

/**
 * Returns validation error message for password or empty string if valid
 */
export const getPasswordErrorMessage = (password: string): string => {
  if (!password) return "";
  if (password.length < 8) return "Password must be at least 8 characters long";
  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(password))
    return "Password must contain at least one lowercase letter";
  if (!/[0-9]/.test(password))
    return "Password must contain at least one number";
  return "";
};

/**
 * Validates a name field (not empty and only contains valid characters)
 */
export const validateName = (name: string): boolean => {
  return name.trim().length > 0 && /^[a-zA-Z\s'-]+$/.test(name);
};
