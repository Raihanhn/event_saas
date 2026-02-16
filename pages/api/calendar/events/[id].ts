// pages/api/calendar/events/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Event from "@/modules/events/event.model";
import Task from "@/modules/tasks/task.model";
import { requireAuth } from "@/lib/auth";
import { Types } from "mongoose";

export default requireAuth(async (req: NextApiRequest & { user?: any }, res: NextApiResponse) => {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  await connectDB();
  const { id } = req.query;

  if (!Types.ObjectId.isValid(id as string)) return res.status(400).json({ message: "Invalid event ID" });

  try {
    const event = await Event.findOne({ _id: id, organization: req.user.organization }).lean();
    if (!event) return res.status(404).json({ message: "Event not found" });

    const tasks = await Task.find({ event: id, organization: req.user.organization }).lean();

    res.status(200).json({ ...event, tasks });
  } catch (err) {
    console.error("Fetch single event error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
