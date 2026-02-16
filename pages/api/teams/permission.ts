// pages/api/teams/permission.ts
import { connectDB } from "@/lib/mongodb";
import User from "@/modules/users/user.model";
import { requireAuth } from "@/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default requireAuth(async function handler(
  req: NextApiRequest & { user?: any },
  res: NextApiResponse
) {
  if (req.user!.role !== "admin") {
    return res.status(403).end();
  }

  const { userId, canEditVendor } = req.body;

  await connectDB();

  await User.findByIdAndUpdate(userId, {
    permissions: { canEditVendor },
  });

  res.status(200).json({ success: true });
});
