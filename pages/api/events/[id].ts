// pages/api/events/[id].ts

import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Event from "@/modules/events/event.model";
import Task from "@/modules/tasks/task.model";
import Budget from "@/modules/budgets/budget.model";
import { requireAuth } from "@/lib/auth";
import { Types } from "mongoose";

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

    const eventId = Array.isArray(id) ? id[0] : id;

  console.log("API called:", req.method, "for Event ID:", eventId);

  if (!eventId || !Types.ObjectId.isValid(eventId)) {
    console.log("Invalid Event ID");
    return res.status(400).json({ message: "Invalid event ID" });
  }

  // if (!Types.ObjectId.isValid(id as string)) {
  //   return res.status(400).json({ message: "Invalid event ID" });
  // }

  // ======================
  // UPDATE EVENT (PATCH)
  // ======================
   if (req.method === "PATCH") {
    try {
      console.log("PATCH body received:", req.body);

      const updated = await Event.findOneAndUpdate(
        {
          _id: new Types.ObjectId(eventId),
          organization: new Types.ObjectId(req.user.organization),
        },
        {
          $set: {
            name: req.body.name,
            startDate: req.body.startDate
              ? new Date(req.body.startDate)
              : undefined,
            endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            isFlexible: req.body.isFlexible,
            location: req.body.location,
            status: req.body.status,
            totalBudget: req.body.totalBudget,
            clients: Array.isArray(req.body.clients)
              ? req.body.clients.map((c: any) =>
                  typeof c === "string" ? new Types.ObjectId(c) : new Types.ObjectId(c._id)
                )
              : [],
          },
        },
        { new: true }
      );

      console.log("Update result:", updated);

      if (!updated) {
        console.log("Event not found or org mismatch");
        return res.status(404).json({ message: "Event not found" });
      }

      return res.status(200).json(updated);
    } catch (err) {
      console.error("Error updating event:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // ======================
  // DELETE EVENT
  // ======================
  if (req.method === "DELETE") {
    const deleted = await Event.findOneAndDelete({
      _id: id,
      organization: req.user.organization,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Delete all related tasks
    await Task.deleteMany({ event: deleted._id });

    // Delete all related budgets
    await Budget.deleteMany({ event: deleted._id });

    return res.status(200).json({ message: "Event deleted" });
  }

  // ======================
  // METHOD NOT ALLOWED
  // ======================
  return res.status(405).json({ message: "Method not allowed" });
});
