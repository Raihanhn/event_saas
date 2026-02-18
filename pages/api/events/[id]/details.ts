// pages/api/events/[id]/details.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Event from "@/modules/events/event.model";
import Task from "@/modules/tasks/task.model";
import { requireAuth } from "@/lib/auth";
import { Types } from "mongoose";

// Add this to avoid model overwrite issues in Next.js dev
import mongoose from "mongoose";
const Client =
  mongoose.models.Client || require("@/modules/clients/client.model").default;

export default requireAuth(
  async (req: NextApiRequest & { user?: any }, res: NextApiResponse) => {
    const { id } = req.query;
    const eventId = Array.isArray(id) ? id[0] : id;

    if (!eventId || !Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    await connectDB();

    try {
      const event = await Event.findOne({
        _id: eventId,
        organization: req.user.organization,
      })
        .select("name startDate endDate isFlexible totalBudget clients")
        .populate("clients", "name avatar") // now Client model exists
        .lean();

      if (!event) return res.status(404).json({ message: "Event not found" });

      /* ✅ Count tasks for this event */
      const tasksCount = await Task.countDocuments({
        event: eventId,
        organization: req.user.organization,
      });

      return res.status(200).json({ ...event, tasksCount });
    } catch (err) {
      console.error("Event details fetch error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  },
);
