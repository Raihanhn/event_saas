// pages/api/teams/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import User from "@/modules/users/user.model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { id } = req.query;
    const { name, email, phone, location, permissions } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        location,
        permissions: {
          canEditVendor: permissions?.canEditVendor ?? false,
        },
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Team member not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update team error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
