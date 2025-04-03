import { ReactNode } from "react";
import Sidebar from "../sidebar/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark">
      <Sidebar />
      <main className="lg:ml-64">
        <div className="p-4 lg:p-0">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
