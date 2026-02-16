//api/clients/create.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Client from "@/modules/clients/client.model";
import { requireAuth } from "@/lib/auth";
import { getRandomAvatar } from "@/lib/avatar";
import crypto from "crypto";

export default requireAuth(async function handler(
  req: NextApiRequest & { user?: any },
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  await connectDB();

  const { name, email, phone, avatar } = req.body;
  const accessToken = crypto.randomBytes(32).toString("hex");

  const client = await Client.create({
    name,
    email,
    phone,
    avatar: avatar || getRandomAvatar(),
    organization: req.user!.organization,
    createdBy: req.user!.id,
    accessToken,
  });

  console.log("CLIENT SAVED WITH TOKEN:", {
  id: client._id,
  accessToken: client.accessToken,
});
  console.log("USER:", req.user);

  res.status(201).json(client);
});
