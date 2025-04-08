import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications | JobBoard",
  description: "View and manage your notifications",
};

export default function NotificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
