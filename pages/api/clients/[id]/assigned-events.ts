// pages/api/clients/[id]/assigned-events.ts
import { connectDB } from "@/lib/mongodb";
import Event from "@/modules/events/event.model";
import Client from "@/modules/clients/client.model";
import { requireAuth } from "@/lib/auth";

export default requireAuth(async (req: any, res) => {
  await connectDB();

  const { id } = req.query;

  const client = await Client.findOne({
    _id: id,
    organization: req.user.organization,
  });

  if (!client) return res.status(404).json([]);

  const events = await Event.find({
    clients: client._id, // ← event model এ clients field থাকতে হবে
    organization: req.user.organization,
  })
    .select("name startDate")
    .lean();

  res.json(events);
});
