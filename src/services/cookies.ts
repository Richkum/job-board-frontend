// "use client";

// import Cookies from "js-cookie";

// // Cookie options for better security
// const COOKIE_OPTIONS = {
//   secure: process.env.NODE_ENV === "production", // Secure in production
//   sameSite: "strict" as const,
//   expires: 7, // 7 days
//   path: "/",
// };

// /**
//  * Set a secure cookie
//  */
// export const setCookie = (name: string, value: string, options = {}) => {
//   Cookies.set(name, value, { ...COOKIE_OPTIONS, ...options });
// };

// /**
//  * Get cookie value
//  */
// export const getCookie = (name: string) => {
//   return Cookies.get(name);
// };

// /**
//  * Remove a cookie
//  */
// export const removeCookie = (name: string) => {
//   Cookies.remove(name, { path: "/" });
// };

// /**
//  * Set authentication tokens and user data
//  */
// export const setAuthCookies = (token: string, user: any) => {
//   setCookie("token", token);

//   // Also store in localStorage for easy access in JS
//   if (typeof window !== "undefined") {
//     localStorage.setItem("token", token);
//     localStorage.setItem("user", JSON.stringify(user));
//   }
// };

// /**
//  * Clear authentication cookies and data
//  */
// export const clearAuthCookies = () => {
//   removeCookie("token");

//   // Also clear localStorage
//   if (typeof window !== "undefined") {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//   }
// };
