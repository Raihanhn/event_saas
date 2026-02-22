//pages/api/paddle/webhook.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { Paddle, Environment } from "@paddle/paddle-node-sdk";
import Organization from "@/modules/org/organization.model";

// Disable body parser
export const config = { api: { bodyParser: false } };

const paddle = new Paddle(process.env.PADDLE_SECRET_TOKEN!, { environment: Environment.sandbox });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  const rawBody = Buffer.concat(chunks).toString("utf8");

  const signature = req.headers["paddle-signature"] as string;
  const webhookSecret = process.env.WEBHOOK_SECRET_KEY!;
  if (!signature) return res.status(400).json({ error: "Missing signature header" });

  try {
    const event = await paddle.webhooks.unmarshal(rawBody, webhookSecret, signature);
    console.log("Webhook event:", event.eventType);

    switch (event.eventType) {
      case "subscription.created": {
        const sub = event.data;
        await Organization.findByIdAndUpdate(sub.customData.orgId, {
          plan: sub.customData.plan,
          paddleSubscriptionId: sub.id,
          paddleCustomerId: sub.customerId,
          paddlePriceId: sub.items[0].priceId,
          subscriptionStatus: sub.status,
        });
        break;
      }

      case "subscription.updated": {
        await Organization.findOneAndUpdate(
          { paddleSubscriptionId: event.data.id },
          { subscriptionStatus: event.data.status }
        );
        break;
      }

      case "subscription.canceled": {
        await Organization.findOneAndUpdate(
          { paddleSubscriptionId: event.data.id },
          { plan: "free", subscriptionStatus: "canceled" }
        );
        break;
      }

      default:
        console.log("Unhandled Paddle event:", event.eventType);
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(400).json({ error: "Invalid webhook signature" });
  }
}