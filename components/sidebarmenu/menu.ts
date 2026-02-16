// components/sidebar/menu.ts
import {
  Home,
  Calendar,
  Users,
  FileText,
  Folder,
  Settings,
} from "lucide-react";

// Admin menu – sees all
export const adminMenu = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Events", href: "/dashboard/events", icon: Folder },
   { name: "Teams", href: "/dashboard/teams", icon: Users },
  { name: "Vendors", href: "/dashboard/vendors", icon: Users },
  { name: "Budget", href: "/dashboard/budget", icon: FileText },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { name: "Clients", href: "/dashboard/clients", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

// Team member menu – limited
export const teamMenu = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Events", href: "/dashboard/events", icon: Folder },
  { name: "Vendors", href: "/dashboard/vendors", icon: Users },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
];
