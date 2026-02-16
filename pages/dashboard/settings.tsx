//pages/dashboard/settings.tsx


"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useThemeContext } from "@/context/ThemeContext";
import { Sun, Moon, LogOut } from "lucide-react";

export default function Settings() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useThemeContext();

  const handleManageSubscription = async () => {
    const res = await fetch("/api/stripe/manage", { method: "POST" });
    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <div className="p-4 md:p-6 h-screen space-y-6 max-w-7xl mx-auto">
      {/* PAGE TITLE */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your account and subscription
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ADMIN INFO */}
        <div className="lg:col-span-2 rounded-2xl border p-6 bg-white dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Admin Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-medium ">{user?.email}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Role</p>
              <p className="font-medium capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* APPEARANCE */}
        <div className="rounded-2xl border p-6 bg-white dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between">
          <h2 className="text-lg font-semibold mb-4">Appearance</h2>

          <button
            onClick={toggleTheme}
            className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium transition
              ${
                theme === "dark"
                  ? "bg-green-600 text-white"
                  : "bg-green-600 text-white"
              }
            `}
          >
            {theme === "dark" ? (
              <>
                <Sun size={18} /> Light Mode
              </>
            ) : (
              <>
                <Moon size={18} /> Dark Mode
              </>
            )}
          </button>
        </div>

        {/* SUBSCRIPTION */}
        <div className="lg:col-span-2 rounded-2xl border p-6 bg-white dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Subscription</h2>

          <button
            onClick={handleManageSubscription}
            className="px-5 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black"
          >
            Manage Subscription
          </button>
        </div>

        {/* ACCOUNT */}
        <div className="rounded-2xl border p-6 bg-white dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Account</h2>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
        <div className="h-56"></div>
    </div>
  );
}
