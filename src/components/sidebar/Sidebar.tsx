import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Building2,
  MessageSquare,
  Bell,
  Bookmark,
  Settings,
  Menu,
  X,
  LogOut,
  Sun,
  Moon,
  FileText,
  User,
  BarChart2,
  HelpCircle,
  Award,
  Heart,
  CheckSquare,
  Upload,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import LogoutButton from "../ui/logout";

// Define the SidebarLink interface
interface SidebarLink {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles?: string[]; // Specify which user roles can see this link
}

// Define all sidebar links with role permissions
const sidebarLinks: SidebarLink[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    href: "/jobs",
    label: "Browse Jobs",
    icon: <Search size={20} />,
    roles: ["jobSeeker", "admin"],
  },
  {
    href: "/jobs/manage",
    label: "Manage Jobs",
    icon: <Briefcase size={20} />,
    roles: ["employer", "admin"],
  },
  {
    href: "/post-job",
    label: "Post Job",
    icon: <Upload size={20} />,
    roles: ["employer", "admin"],
  },
  {
    href: "/companies",
    label: "Companies",
    icon: <Building2 size={20} />,
  },
  {
    href: "/candidates",
    label: "Candidates",
    icon: <Users size={20} />,
    roles: ["employer", "admin"],
  },
  {
    href: "/applications",
    label: "Applications",
    icon: <FileText size={20} />,
    roles: ["jobSeeker", "admin"],
  },
  {
    href: "/applications/review",
    label: "Review Applications",
    icon: <CheckSquare size={20} />,
    roles: ["employer", "admin"],
  },
  {
    href: "/messages",
    label: "Messages",
    icon: <MessageSquare size={20} />,
  },
  {
    href: "/notifications",
    label: "Notifications",
    icon: <Bell size={20} />,
  },
  {
    href: "/saved",
    label: "Saved Jobs",
    icon: <Bookmark size={20} />,
    roles: ["jobSeeker", "admin"],
  },
  {
    href: "/favorites",
    label: "Favorite Candidates",
    icon: <Heart size={20} />,
    roles: ["employer", "admin"],
  },
  {
    href: "/profile",
    label: "My Profile",
    icon: <User size={20} />,
  },
  {
    href: "/analytics",
    label: "Analytics",
    icon: <BarChart2 size={20} />,
    roles: ["employer", "admin"],
  },
  {
    href: "/admin",
    label: "Admin Panel",
    icon: <ShieldCheck size={20} />,
    roles: ["admin"],
  },
  {
    href: "/resources",
    label: "Resources",
    icon: <HelpCircle size={20} />,
  },
  {
    href: "/premium",
    label: "Premium",
    icon: <Award size={20} />,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: <Settings size={20} />,
  },
];

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Handle dark mode
  useEffect(() => {
    // Check if user prefers dark mode
    const isDark = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("darkMode", (!isDarkMode).toString());
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Filter links based on user role
  const filteredLinks = sidebarLinks.filter(
    (link) => !link.roles || (user && link.roles.includes(user.role ?? ""))
  );

  // Group links by section
  const mainLinks = filteredLinks.filter(
    (link) =>
      !link.href.includes("/resources") &&
      !link.href.includes("/premium") &&
      !link.href.includes("/settings") &&
      !link.href.includes("/admin")
  );

  const utilityLinks = filteredLinks.filter(
    (link) =>
      link.href.includes("/resources") ||
      link.href.includes("/premium") ||
      link.href.includes("/settings") ||
      link.href.includes("/admin")
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-40 p-2 rounded-md bg-bgCard dark:bg-bgCard-dark lg:hidden"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X size={24} className="text-text dark:text-text-dark" />
        ) : (
          <Menu size={24} className="text-text dark:text-text-dark" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-screen transition-transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-64 bg-bgCard dark:bg-bgCard-dark border-r border-border dark:border-border-dark`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-center h-16 border-b border-border dark:border-border-dark">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white text-xl">J</span>
            </div>
            <span className="text-xl font-bold text-primary dark:text-primary-dark">
              JobBoard
            </span>
          </Link>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 border-b border-border dark:border-border-dark">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <User size={20} className="text-gray-500" />
              </div>
              <div>
                <div className="font-medium">{user.username}</div>
                <div className="text-sm text-gray-500">
                  {user.role === "jobSeeker"
                    ? "Job Seeker"
                    : user.role === "employer"
                    ? "Employer"
                    : "Admin"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="py-4 flex flex-col h-[calc(100%-8rem)] overflow-y-auto">
          <nav className="flex-grow space-y-1 px-3">
            {/* Main Navigation section */}
            <div className="mb-4">
              <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider">
                Navigation
              </div>
              {mainLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-2 mb-1 rounded-md transition-colors ${
                      isActive
                        ? "bg-primary text-white dark:bg-primary-dark"
                        : "text-textSecondary dark:text-textSecondary-dark hover:bg-bgSecondary dark:hover:bg-bgSecondary-dark"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Utilities section */}
            {utilityLinks.length > 0 && (
              <div>
                <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider">
                  Utilities
                </div>
                {utilityLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-2 mb-1 rounded-md transition-colors ${
                        isActive
                          ? "bg-primary text-white dark:bg-primary-dark"
                          : "text-textSecondary dark:text-textSecondary-dark hover:bg-bgSecondary dark:hover:bg-bgSecondary-dark"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </nav>

          {/* Bottom Section */}
          <div className="mt-auto p-4 border-t border-border dark:border-border-dark space-y-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-3 w-full px-4 py-2 rounded-md text-textSecondary dark:text-textSecondary-dark hover:bg-bgSecondary dark:hover:bg-bgSecondary-dark transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
            </button>

            {/* Logout Button */}
            <LogoutButton />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
