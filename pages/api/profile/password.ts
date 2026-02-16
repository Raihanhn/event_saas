import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import User from "@/modules/users/user.model";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";

export default requireAuth(async (req: any, res: NextApiResponse) => {
  if (req.method !== "PUT") return res.status(405).json({ message: "Method not allowed" });
  await connectDB();

  const { current, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(current, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update password" });
  }
});
