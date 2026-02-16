// components/layouts/DashboardLayout.tsx
"use client";

import { useState,  useEffect  } from "react";
import Header from "../Header";
import Footer from "../Footer";
import Sidebar from "../Sidebar";
import { useRouter } from "next/navigation";
import { adminMenu, teamMenu } from "../sidebarmenu/menu";
import { useAuth } from "@/context/AuthContext";
import { useThemeContext } from "@/context/ThemeContext";


interface LayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };
  const { theme } = useThemeContext();

  const { user, loading } = useAuth();
const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/signin");
    }
  }, [loading, user, router]);

  // if (loading) {
  //   return <div className="p-6">Loading...</div>;
  // }

  if (!user) {
    return null; // prevents flash before redirect
  }


  const menuItems = user.role === "admin" ? adminMenu : teamMenu;

  return (
    <div  className={`
        flex flex-col min-h-screen
        ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}
      `}>
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          toggleCollapse={toggleCollapse}
          onCloseMobile={() => setMobileOpen(false)}
           menuItems={menuItems}
        />

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <Header />

          {/* Page content */}
          <main className="flex-1 overflow-auto p-4">{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
