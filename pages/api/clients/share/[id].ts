//pages/api/clients/share/[id].ts

import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Client from "@/modules/clients/client.model";
import { requireAuth } from "@/lib/auth";
import crypto from "crypto";

export default requireAuth(async (req: NextApiRequest & { user?: any }, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id, eventId } = req.query as {
    id: string;
    eventId?: string;
  };

  if (!eventId) {
    return res.status(400).json({ message: "Event required" });
  }

  await connectDB();

  const client = await Client.findOne({
    _id: id,
    organization: req.user!.organization,
  });

  if (!client) {
    return res.status(404).json({ message: "Client not found" });
  }

  // generate token once
  if (!client.accessToken) {
    client.accessToken = crypto.randomBytes(32).toString("hex");
    await client.save();
  }

  const link = `${process.env.NEXT_PUBLIC_CLIENT_URL}/client/view/${eventId}?token=${client.accessToken}`;

  res.status(200).json({ link });
});
