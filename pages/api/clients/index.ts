//api/clients/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Client from "@/modules/clients/client.model";
import { requireAuth } from "@/lib/auth";

export default requireAuth(async function handler(
  req: NextApiRequest & { user?: any },
  res: NextApiResponse
) {
  await connectDB();

  const { organization } = req.user!;
  const q = req.query.q as string;

  const query: any = { organization };

  if (q) {
    query.$or = [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
      { phone: { $regex: q, $options: "i" } },
    ];
  }

  const clients = await Client.find(query)
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json(clients);
});
