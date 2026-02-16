// pages/api/teams/index.ts
import { connectDB } from "@/lib/mongodb";
import User from "@/modules/users/user.model";
import { requireAuth } from "@/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default requireAuth(async function handler(
  req: NextApiRequest & { user?: any },
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const members = await User.find({ organization: req.user!.organization })
      .select("_id name email role permissions phone location")
      .lean(); // ✅ convert to plain JS objects

    return res.status(200).json(members);
  } catch (err) {
    console.error("Error fetching team members:", err);
    return res.status(500).json({ message: "Server error" });
  }
});
