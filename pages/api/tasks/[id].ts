// pages/api/tasks/[id].ts

import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Task from "@/modules/tasks/task.model";
import { requireAuth } from "@/lib/auth";
import mongoose, { Types } from "mongoose";

interface AuthUser {
  id: string;
  organization: string;
  role: string;
  permissions?: {
    canEditVendor: boolean;
  };
}

interface AuthRequest extends NextApiRequest {
  user: AuthUser;
}

export default requireAuth(async (req: AuthRequest, res: NextApiResponse) => {
  await connectDB();
  const { id } = req.query;
  const taskId = Array.isArray(id) ? id[0] : id;

  if (!taskId || !Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ message: "Invalid task ID" });
  }
  if (req.method === "PATCH") {
    try {
      const { _id, ...payload } = req.body;

      console.log("UPDATE TASK - Body received:", payload);
      console.log("User org:", req.user.organization);

      // Convert vendors to ObjectIds
      if (payload.vendors) {
        payload.vendors = payload.vendors.map(
          (v: string) => new mongoose.Types.ObjectId(v),
        );
      }

      console.log("Converted vendors:", payload.vendors);

      payload.organization = req.user.organization;

      // Make sure organization is included for security
      const updated = await Task.findOneAndUpdate(
        { _id: taskId, organization: req.user.organization },
        {
          ...payload,
          startTime: payload.startTime,
          endTime: payload.endTime,
          isFlexible: payload.isFlexible,
        },
        { new: true },
      );

      console.log("Task updated:", updated);

      if (!updated) return res.status(404).json({ message: "Task not found" });

      return res.status(200).json(updated);
    } catch (err) {
      console.error("Error updating task:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const deleted = await Task.findOneAndDelete({
        _id: taskId,
        organization: req.user.organization,
      });

      if (!deleted) return res.status(404).json({ message: "Task not found" });

      return res.status(200).json({ message: "Task deleted" });
    } catch (err) {
      console.error("Error deleting task:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
});
