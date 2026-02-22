///api/paddle/manage.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/lib/auth";
import Organization from "@/modules/org/organization.model";

const PADDLE_VENDOR_ID = process.env.PADDLE_VENDOR_ID;

export default requireAuth(async (req: NextApiRequest & { user: any }, res: NextApiResponse) => {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const org = await Organization.findById(req.user.organization);
  if (!org?.paddleSubscriptionId) return res.status(400).json({ message: "No active subscription" });

  const url = `https://vendors.paddle.com/subscription/${org.paddleSubscriptionId}`; // This is Paddle manage link
  return res.status(200).json({ url });
});