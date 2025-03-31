// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class", // This enables dark mode with class strategy
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3b82f6", // Blue for primary actions
          dark: "#2563eb", // Darker blue for hover states
          light: "#eff6ff", // Light blue for backgrounds
        },
        secondary: {
          DEFAULT: "#6366f1", // Indigo as secondary color
          dark: "#4f46e5",
          light: "#eef2ff",
        },
        accent: {
          DEFAULT: "#0ea5e9", // Sky blue as accent
          dark: "#0284c7",
          light: "#f0f9ff",
        },
        success: "#10b981", // Green for success states
        warning: "#f59e0b", // Amber for warnings
        danger: "#ef4444", // Red for errors/danger
        info: "#6b7280", // Gray for information

        // Theme colors (light/dark mode)
        bg: {
          DEFAULT: "#f9fafb", // Light background
          dark: "#111827", // Dark background
        },
        bgSecondary: {
          DEFAULT: "#f3f4f6", // Light secondary background
          dark: "#1f2937", // Dark secondary background
        },
        bgCard: {
          DEFAULT: "#ffffff", // Light card background
          dark: "#374151", // Dark card background
        },
        text: {
          DEFAULT: "#111827", // Dark text for light mode
          dark: "#f9fafb", // Light text for dark mode
        },
        textSecondary: {
          DEFAULT: "#4b5563", // Secondary text for light mode
          dark: "#d1d5db", // Secondary text for dark mode
        },
        textMuted: {
          DEFAULT: "#9ca3af", // Muted text for light mode
          dark: "#6b7280", // Muted text for dark mode
        },
        border: {
          DEFAULT: "#e5e7eb", // Light mode border
          dark: "#374151", // Dark mode border
        },
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "fade-out": "fadeOut 0.3s ease-in-out",
        "slide-in-right": "slideInRight 0.3s ease-in-out",
        "slide-out-right": "slideOutRight 0.3s ease-in-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideOutRight: {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
    },
  },
  plugins: [],
};
