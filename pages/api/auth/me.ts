// pages/api/auth/me.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/lib/auth";
import User from "@/modules/users/user.model";
import { connectDB } from "@/lib/mongodb";

// --------------------
// Type for user returned from DB
// --------------------
interface IUser {
  _id: string;
  name: string; 
  email: string;
  location:string;
  phone:string;
  role: "admin" | "team" | "admin";
  organization: string;
  permissions?: {
    canEditVendor: boolean;
  };
  profileImage?: string;
  themePreference?: "light" | "dark";
}

// Extend NextApiRequest to include authenticated user
interface AuthRequest extends NextApiRequest {
  user?: {
    id: string;
    role: "admin" | "team";
    organization: string;
    permissions?: {
      canEditVendor: boolean;
    };
  };
}

// --------------------
// Handler
// --------------------
async function handler(req: AuthRequest, res: NextApiResponse) {
  // Connect to MongoDB
  try {
    await connectDB();
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    return res.status(500).json({ message: "Database connection failed" });
  }

  // Check if user is attached by middleware
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Fetch fresh user data from DB
    const user = await User.findById(req.user.id).lean<IUser>();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return only necessary fields, include timestamp for profileImage to prevent caching
    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        location:user.location,
        phone:user.phone,
        role: user.role,
        organization: user.organization,
        permissions: user.permissions,
        profileImage: user.profileImage || "/avatar/avatar.jpg",
        themePreference: user.themePreference || "light",
      },
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// --------------------
// Export wrapped with auth
// --------------------
export default requireAuth(handler);

