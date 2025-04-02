"use client";
import React from "react";

function page() {
  async function signOut() {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        // If no token, just redirect to login
        window.location.href = "/";
        return;
      }

      // Call the logout API
      const response = await fetch(
        "http://localhost:5000/api/auth/logout-all",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Clear token from localStorage regardless of server response
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Error during logout:", error);
      // Still clear storage and redirect even if request fails
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard</p>
      <p>Click the button below to logout</p>

      <button className="px-4 py-2 bg-red-500 text-white" onClick={signOut}>
        Logout
      </button>
    </div>
  );
}

export default page;
