// pages/api/tasks/create.ts

import { connectDB } from "@/lib/mongodb";
import Task from "@/modules/tasks/task.model";
import { requireAuth } from "@/lib/auth";
import mongoose from "mongoose";

export default requireAuth(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();

  try {
    const body = req.body;

    console.log("CREATE TASK - Body received:", body);
    console.log("User org:", req.user.organization);

    // Convert vendors from string IDs to ObjectIds
    const vendors = body.vendors?.map(
      (v: string) => new mongoose.Types.ObjectId(v),
    );

    console.log("Converted vendors:", vendors);

    const task = await Task.create({
      ...body,
      event: new mongoose.Types.ObjectId(body.event),
      startTime: body.startTime,
      endTime: body.endTime,
      isFlexible: body.isFlexible,
      vendors,
      organization: req.user.organization,
      status: body.status || "pending",
      taskType: body.taskType || "internal",
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ message: "Server error" });
  }
});
