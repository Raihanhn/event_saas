// planovae/pages/api/tasks/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Task from "@/modules/tasks/task.model";
import "@/modules/vendors/vendor.model";
import { requireAuth } from "@/lib/auth";

export default requireAuth(async function handler(
  req: NextApiRequest & { user?: any },
  res: NextApiResponse
) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    await connectDB();

    if (!req.user || !req.user.organization) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const tasks = await Task.find({
      organization: req.user.organization,
    })
      .populate("event", "_id name startDate endDate")
      .populate("vendors", "_id name")
      .lean();

    return res.status(200).json(tasks);
  } catch (error) {
    console.error("Tasks fetch error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

