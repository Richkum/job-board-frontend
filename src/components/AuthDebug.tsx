"use client";

import { useEffect, useState } from "react";

export default function AuthTest() {
  const [localStorageData, setLocalStorageData] = useState<{
    token: string | null;
    user: any | null;
  }>({
    token: null,
    user: null,
  });

  useEffect(() => {
    // Direct access to localStorage
    try {
      console.log("AUTH TEST: Checking localStorage directly");
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      console.log("AUTH TEST: Raw localStorage values:", {
        token: token?.substring(0, 15) + "...",
        userStr,
      });

      const user = userStr ? JSON.parse(userStr) : null;

      setLocalStorageData({ token, user });

      console.log("AUTH TEST: Parsed values:", {
        hasToken: !!token,
        hasUser: !!user,
        user,
      });
    } catch (error) {
      console.error("AUTH TEST: Error accessing localStorage:", error);
    }
  }, []);

  return (
    <div className="fixed bottom-4 left-4 p-4 bg-white dark:bg-gray-800 rounded shadow-lg z-50 text-xs max-w-xs">
      <h3 className="font-bold mb-2">Auth Test Component</h3>
      <div>
        <strong>Token:</strong>{" "}
        {localStorageData.token ? "✅ Present" : "❌ Missing"}
      </div>
      <div>
        <strong>User:</strong>{" "}
        {localStorageData.user ? "✅ Present" : "❌ Missing"}
      </div>
      {localStorageData.user && (
        <div className="mt-2 overflow-auto max-h-40">
          <pre className="text-[8px]">
            {JSON.stringify(localStorageData.user, null, 2)}
          </pre>
        </div>
      )}
      <div className="mt-2">
        <button
          onClick={() => {
            // Force a manual login
            const token = localStorage.getItem("token");
            const userStr = localStorage.getItem("user");
            if (token && userStr) {
              try {
                const user = JSON.parse(userStr);
                window.location.href = "/dashboard";
                console.log("Manual redirect triggered");
              } catch (e) {
                console.error("Failed to parse user data", e);
              }
            }
          }}
          className="px-2 py-1 bg-green-500 text-white rounded text-xs mr-2"
        >
          Force Dashboard
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.reload();
          }}
          className="px-2 py-1 bg-red-500 text-white rounded text-xs"
        >
          Clear Auth
        </button>
      </div>
    </div>
  );
}
