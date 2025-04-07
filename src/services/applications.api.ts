"use client";
import { CreateApplicationDto } from "@/types/application";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
export const createApplication = async (
  applicationData: CreateApplicationDto,
  token: string
): Promise<void> => {
  const response = await fetch(`${API_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(applicationData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to submit application");
  }
};
