// pages/api/users/set-theme.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import User from "@/modules/users/user.model";
import { requireAuth } from "@/lib/auth";

export default requireAuth(async (req: NextApiRequest & { user: any }, res: NextApiResponse) => {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  
  const { theme } = req.body;
  if (!["light", "dark"].includes(theme)) return res.status(400).json({ message: "Invalid theme" });

  await connectDB();

  await User.findByIdAndUpdate(req.user.id, { themePreference: theme });
  return res.status(200).json({ success: true });
});
