// pages/api/vendors/create.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Vendor from "@/modules/vendors/vendor.model";
import { requireAuth } from "@/lib/auth";
import { getRandomAvatar } from "@/lib/avatar";

export default requireAuth(async function handler(
  req: NextApiRequest & { user?: any },
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  // Only admin can create vendors
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  await connectDB();

  const { name, email, phone, avatar, role } = req.body;

  try {
    const vendor = await Vendor.create({
      name,
      email,
      phone,
      avatar: avatar || getRandomAvatar(), 
      role: role || null,
      organization: req.user.organization,
      createdBy: req.user.id,
    });

    res.status(201).json(vendor);
  } catch (error: any) {
    console.error("Error creating vendor:", error);
    res.status(500).json({ message: "Failed to create vendor" });
  }
});
