
// pages/api/events/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Event from "@/modules/events/event.model";
import Budget from "@/modules/budgets/budget.model";
import { requireAuth } from "@/lib/auth";

export default requireAuth(async function handler(
  req: NextApiRequest & { user?: any },
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await connectDB();

  const { organization, role } = req.user!;

  try {
    // Check if frontend requested budgets
    const includeBudgets = req.query.includeBudgets === "true";

    // Fetch basic events for everyone
    let events = await Event.find({ organization })
      .select("_id name startDate endDate createdAt")
      .sort({ createdAt: -1 })
      .lean();

    // Only admins can see budgets
    if (role === "admin" && includeBudgets) {
      for (let event of events) {
        const budgets = await Budget.find({ event: event._id })
          .populate({
            path: "subcategories.vendors.vendor",
            select: "_id name email phone role avatar",
          })
          .lean();

        event.budgets = budgets;
      }
    }

    // Team role: just return events without budgets
    // You could also remove any sensitive fields here if needed

    return res.status(200).json(events);
  } catch (error) {
    console.error("Events fetch error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

