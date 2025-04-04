import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Applications | JobBoard",
  description: "View and manage your applications",
};

export default function AppplicationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
