// components/Header.tsx
"use client";

import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import ThemeButton from "./ThemeButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MobileSidebar from "./MobileSidebar";
import { useThemeContext } from "@/context/ThemeContext";
import { adminMenu, teamMenu } from "@/components/sidebarmenu/menu"; // ✅ import menus

export default function Header() {
  const router = useRouter();
  const { user } = useAuth();
  const [profileImage, setProfileImage] =
    useState<string>("/avatar/avatar.jpg");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { theme } = useThemeContext();

  const handleAvatarClick = () => {
    router.push("/dashboard/profile");
  };

  useEffect(() => {
    if (user?.profileImage) {
      setProfileImage(user.profileImage);
    } else {
      setProfileImage("/avatar/avatar.jpg");
    }
  }, [user?.profileImage]);

  // Determine menu items based on user role
  const menuItems = user?.role === "admin" ? adminMenu : teamMenu;

  return (
    <header
      className={`w-full rounded-md flex items-center justify-between shadow-md
       ${theme === "dark" ? "bg-[#374151] border-gray-800" : "bg-white border-gray-200"}
     px-4 sm:px-6 py-3 border-b`}
    >
      {/* LEFT: Hamburger + User Info */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3 cursor-pointer"
        onClick={handleAvatarClick}
      >
        {/* Hamburger Menu (Mobile Only) */}
        <button
          className="md:hidden p-2 text-gray-700 dark:text-gray-300 mr-2"
          onClick={(e) => {
            e.stopPropagation(); // prevent avatar click
            setMobileSidebarOpen(true);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Avatar */}
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
          <Image
            src={profileImage}
            alt="User Avatar"
            fill
            className="object-cover"
            priority={true}
          />
        </div>

        {/* Name & Role */}
        <div className="leading-tight">
          <p
            className={`text-sm font-semibold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            } capitalize`}
          >
            {user?.name || "Guest"}
          </p>
          <p
            className={`text-xs ${
              theme === "dark" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {user?.role || "User"}
          </p>
        </div>
      </motion.div>

      {/* RIGHT: Notification + Theme */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center gap-3 relative"
      >
        <ThemeButton />

        <button className={`w-10 h-10 flex items-center justify-center rounded-full border
        ${theme === "dark" ? " hover:bg-gray-800 border-gray-700 text-gray-900" : "text-white border-gray-100 bg-gray-100 "}
         transition`}>
          <Bell className={`w-5 h-5
          ${theme === "dark" ? "text-gray-200" : " text-gray-700"}`} />
        </button>

        {/* Notification dot */}
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
      </motion.div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        menuItems={menuItems}
      />
    </header>
  );
}
