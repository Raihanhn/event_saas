// context/ThemeContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useTheme as useNextTheme } from "next-themes";
import { useAuth } from "./AuthContext";

interface ThemeContextType {
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { themePreference, setThemePreference } = useAuth();
  const { theme: nextTheme, setTheme: setNextTheme } = useNextTheme();
  const [theme, setThemeState] = useState<"light" | "dark" | "system">(
    themePreference || "light"
  );

  // Sync theme state with auth user's preference
  useEffect(() => {
    if (themePreference) setThemeState(themePreference);
  }, [themePreference]);

  const setTheme = (value: "light" | "dark") => {
    setNextTheme(value);
    setThemeState(value);
    setThemePreference(value); // update backend via AuthContext
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeContext must be used inside ThemeProvider");
  return ctx;
};

