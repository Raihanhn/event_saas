// pages/api/dashboard/counts.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";
import Event from "@/modules/events/event.model";
import Client from "@/modules/clients/client.model";
import User from "@/modules/users/user.model";
import Vendor from "@/modules/vendors/vendor.model";

export default requireAuth(async function handler(
  req: NextApiRequest & { user?: any },
  res: NextApiResponse
) {
  try {
    await connectDB();

    const { organization } = req.user!;

    const [eventsCount, clientsCount, teamsCount, vendorsCount] = await Promise.all([
      Event.countDocuments({ organization }),
      Client.countDocuments({ organization }),
      User.countDocuments({ organization }),
      Vendor.countDocuments({ organization }),
    ]);

    return res.status(200).json({
      eventsCount,
      clientsCount,
      teamsCount,
      vendorsCount,
    });
  } catch (err) {
    console.error("Dashboard counts fetch error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});
