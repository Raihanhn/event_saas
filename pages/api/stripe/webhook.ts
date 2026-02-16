import type { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "@/lib/stripe";
import Organization from "@/modules/org/organization.model";
import { buffer } from "micro";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const sig = req.headers["stripe-signature"]!;
  const buf = await buffer(req);

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription
        );

        await Organization.findOneAndUpdate(
          { stripeCustomerId: session.customer },
          {
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0].price.id,
            plan:
              subscription.items.data[0].price.id ===
              process.env.STRIPE_GROWTH_PRICE_ID
                ? "growth"
                : "studio",
          }
        );
        break;
      }

      case "customer.subscription.deleted": {
        await Organization.findOneAndUpdate(
          { stripeSubscriptionId: event.data.object.id },
          {
            plan: "free",
            stripeSubscriptionId: null,
            stripePriceId: null,
          }
        );
        break;
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    res.status(500).end();
  }
}
