//context/AuthContext.tsx

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "team" | "client";
  organization: string;
  phone?: string;
  location?: string;
  profileImage?: string;
  permissions?: { canEditVendor: boolean };
  themePreference?: "light" | "dark";
}

interface AuthContextType {
  user: User | null;
  themePreference: "light" | "dark";
  loading: boolean;
  setUser: (user: User | null) => void;
  setThemePreference: (theme: "light" | "dark") => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser?: User | null;
}

export function AuthProvider({ children, initialUser = null }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [themePreference, setThemePreferenceState] = useState<"light" | "dark">(
    initialUser?.themePreference || "light"
  );
  const [loading, setLoading] = useState(!initialUser);
  const router = useRouter();

  // Sync themePreference when user changes
  useEffect(() => {
    if (user?.themePreference) setThemePreferenceState(user.themePreference);
  }, [user]);

  // Load user if no initialUser
  useEffect(() => {
    if (initialUser) {
      setLoading(false);
      return;
    }

    async function loadUser() {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok) {
          setUser(null);
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [initialUser]);

  const setThemePreference = async (theme: "light" | "dark") => {
    setThemePreferenceState(theme);

    // Save to backend
    try {
      await fetch("/api/users/set-theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ theme }),
      });

      // Update user object in context
      setUser(prev => (prev ? { ...prev, themePreference: theme } : prev));
    } catch (err) {
      console.error("Failed to save theme:", err);
    }
  };

  const refreshUser = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.error("Failed to refresh user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      setUser(null);
      router.push("/auth/signin");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        themePreference,
        loading,
        setUser,
        setThemePreference,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
