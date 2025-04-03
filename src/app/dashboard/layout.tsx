import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Dashboard | JobBoard",
  description: "View and manage your applications, jobs and many more",
};

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
