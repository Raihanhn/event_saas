//components/ThemeButton.tsx
"use client";

import { RiSunFill, RiMoonFill } from "react-icons/ri";
import { useThemeContext } from "@/context/ThemeContext";

export default function ThemeButton() {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      className="flex items-center justify-center p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
      onClick={toggleTheme}
    >
      {theme === "dark" ? (
        <RiMoonFill className="h-5 w-5 text-orange-500" />
      ) : (
        <RiSunFill className="h-5 w-5 text-slate-800" />
      )}
    </button>
  );
}
