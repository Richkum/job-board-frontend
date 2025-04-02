"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

import LoadingIndicator from "@/components/ui/Loading";
import { Button } from "./button";
import Modal from "./Logout-Modal";

const LogoutButton = () => {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        className="px-4 py-2 bg-danger text-white rounded"
        onClick={() => setIsOpen(true)}
      >
        Logout
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Logout"
      >
        <p className="text-gray-700 dark:text-gray-300">
          Are you sure you want to log out?
        </p>
        <div className="mt-4 flex justify-end space-x-2">
          <Button
            className="bg-gray-300 dark:bg-gray-600"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="bg-danger text-white"
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? <LoadingIndicator /> : "Logout"}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default LogoutButton;
