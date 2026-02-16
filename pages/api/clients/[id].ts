// api/clients/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Client from "@/modules/clients/client.model";
import { requireAuth } from "@/lib/auth";

export default requireAuth(async function handler(
  req: NextApiRequest & { user?: any },
  res: NextApiResponse
) {
  await connectDB();

  const { id } = req.query;

  if (req.method === "DELETE") {
    const client = await Client.findOneAndDelete({
      _id: id,
      organization: req.user!.organization,
    });

    if (!client) return res.status(404).json({ message: "Client not found" });

    return res.status(200).json({ message: "Client deleted" });
  }

  if (req.method === "PUT") {
    const { name, email, phone } = req.body;

    const updatedClient = await Client.findOneAndUpdate(
      { _id: id, organization: req.user!.organization },
      { name, email, phone },
      { new: true }
    );

    if (!updatedClient) return res.status(404).json({ message: "Client not found" });

    return res.status(200).json(updatedClient);
  }

  res.status(405).json({ message: "Method not allowed" });
});
