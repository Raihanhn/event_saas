//pages/api/paddle/checkout.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { Paddle, Environment } from "@paddle/paddle-node-sdk";
import { requireAuth } from "@/lib/auth";
import Organization from "@/modules/org/organization.model";
import { PADDLE_PRICE_IDS } from "@/lib/paddle-plans";

const paddle = new Paddle(process.env.PADDLE_SECRET_TOKEN!, {
  environment: Environment.sandbox,
});

export default requireAuth(async function handler(
  req: NextApiRequest & { user: any },
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { plan } = req.body;
  const priceId = PADDLE_PRICE_IDS[plan];
  if (!priceId) return res.status(400).json({ message: "Invalid plan" });

  try {
    const org = await Organization.findById(req.user.organization);
    if (!org) return res.status(404).json({ message: "Organization not found" });

    const txn = await paddle.transactions.create({
      items: [{ priceId, quantity: 1 }],
      customData: {
        orgId: org._id.toString(),
        userId: req.user.id,
        plan,
      },
    });

    return res.status(200).json({ txnId: txn.id });
  } catch (err) {
    console.error("Paddle checkout error:", err);
    return res.status(500).json({ message: "Checkout failed" });
  }
});