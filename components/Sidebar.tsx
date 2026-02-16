"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useThemeContext } from "@/context/ThemeContext";

interface SidebarProps {
  collapsed: boolean;
  toggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  menuItems: { name: string; href: string; icon: any }[];
}

export default function Sidebar({
  collapsed,
  toggleCollapse,
  mobileOpen,
  onCloseMobile,
  menuItems,
}: SidebarProps) {
  const pathname = usePathname();

  const { logout } = useAuth();
  const { theme } = useThemeContext();

  // Load collapsed state (optional sync)
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") toggleCollapse();
  }, []);

  const navItems = menuItems;

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 220 }}
        transition={{ duration: 0.25 }}
        className={`
          fixed md:relative z-50
          ${theme === "dark" ? "bg-gray-800 border-[rgba(51,65,85,0.6)]" : "bg-[rgba(249,250,251,0.9)] border-[rgba(229,231,235,0.7)]"}
          backdrop-blur-md    md:flex hidden
          shadow-lg
          rounded-2xl
          p-3
          flex flex-col justify-between
        `}
        style={{
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        }}
      >
        {/* Top */}
        <div>
          {/* Brand */}
          <div className="flex items-center justify-between mb-6">
            <div
              className={`font-bold text-lg ${theme === "dark" ? "text-gray-100" : " text-gray-900"}`}
            >
              {collapsed ? "P" : "Planovae"}
            </div>

            <button
              onClick={toggleCollapse}
              className="
                p-1 rounded-md
                text-gray-600 dark:text-gray-300
                hover:bg-[rgba(79,70,229,0.08)]
                dark:hover:bg-[rgba(129,140,248,0.15)]
                transition
              "
            >
              {collapsed ? "▶" : "◀"}
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                      ${
                        isActive
                          ? theme === "dark"
                            ? "bg-indigo-900 text-indigo-400"
                            : "bg-indigo-100 text-indigo-600"
                          : theme === "dark"
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-md
                      ${
                        isActive
                          ? theme === "dark"
                            ? "text-indigo-400"
                            : "text-indigo-600"
                          : theme === "dark"
                            ? "text-gray-400"
                            : "text-gray-600"
                      }
                    `}
                    >
                      <Icon size={20} />
                    </div>

                    {!collapsed && (
                      <span className="text-sm font-medium">{item.name}</span>
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        {!collapsed && (
          <button
            onClick={logout}
            className="
              flex items-center gap-3 px-3 py-2 mt-4 rounded-lg
              text-red-600 dark:text-red-400
              hover:bg-[rgba(239,68,68,0.1)]
              dark:hover:bg-[rgba(239,68,68,0.2)]
              transition
            "
          >
            <FaSignOutAlt size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        )}
      </motion.aside>
    </>
  );
}
