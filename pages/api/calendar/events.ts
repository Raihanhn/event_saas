// pages/api/calendar/events.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Event, { IEvent } from "@/modules/events/event.model";
import Task, { ITask } from "@/modules/tasks/task.model";
import { requireAuth } from "@/lib/auth";

interface AuthRequest extends NextApiRequest {
  user?: {
    id: string;
    organization: string;
    role: string;
    permissions?: any;
  };
}

export default requireAuth(async (req: AuthRequest, res: NextApiResponse) => {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  await connectDB();

  const { organization } = req.user!;

  try {
    // Fetch events as plain objects
    const eventsRaw = await Event.find({ organization }).sort({ startDate: 1 }).lean();
    const events: IEvent[] = eventsRaw as unknown as IEvent[]; // ✅ type assertion

    // Fetch tasks as plain objects
    const tasksRaw = await Task.find({ organization })
      .populate("event", "_id name startDate endDate")
      .lean();
    const tasks: (ITask & { event?: IEvent })[] = tasksRaw as unknown as (ITask & { event?: IEvent })[];

    // Group tasks by eventId
    const tasksByEvent: Record<string, ITask[]> = {};
    tasks.forEach((task) => {
      const eventId = task.event?._id?.toString();
      if (!eventId) return; // skip tasks without event
      if (!tasksByEvent[eventId]) tasksByEvent[eventId] = [];
      tasksByEvent[eventId].push(task);
    });

    // Attach tasks to events
    const calendarData = events.map((event) => {
      const eventId = event._id.toString();
      return {
        ...event,
        tasks: tasksByEvent[eventId] || [],
      };
    });

    res.status(200).json(calendarData);
  } catch (err) {
    console.error("Calendar events fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
