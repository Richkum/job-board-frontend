import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Available Jobs | JobBoard",
  description: "Browse and find the best job for you to apply",
};

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
