// pages/api/vendors/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import { requireAuth } from "@/lib/auth";
import Vendor from "@/modules/vendors/vendor.model";

export default requireAuth(async (req: NextApiRequest & { user?: any }, res: NextApiResponse) => {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  await connectDB();

  try {
    const vendors = await Vendor.find({
      organization: req.user.organization,
    }).select("_id name email phone role avatar").lean();

    return res.status(200).json(vendors);
  } catch (err) {
    console.error("Vendor fetch error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});
