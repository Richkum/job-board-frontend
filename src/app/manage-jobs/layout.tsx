import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your jobs | JobBoard",
  description: "View and manage your Jobs",
};

export default function ManageJpbsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
