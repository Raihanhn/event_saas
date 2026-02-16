import type { NextApiRequest, NextApiResponse } from "next";
import { stripe, STRIPE_PRICE_IDS } from "@/lib/stripe";
import { requireAuth } from "@/lib/auth";
import Organization from "@/modules/org/organization.model";

export default requireAuth(async function handler(
  req: NextApiRequest & { user: any },
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { plan } = req.body;
  const priceId = STRIPE_PRICE_IDS[plan];

  if (!priceId) {
    return res.status(400).json({ message: "Invalid plan" });
  }

  try {
    const org = await Organization.findById(req.user.organization);
    if (!org) return res.status(404).json({ message: "Organization not found" });

    // Create customer only once
    let customerId = org.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        metadata: {
          orgId: org._id.toString(),
          userId: req.user.id,
        },
      });

      customerId = customer.id;
      org.stripeCustomerId = customerId;
      await org.save();
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=cancel`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return res.status(500).json({ message: "Stripe checkout failed" });
  }
});
