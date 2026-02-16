import type { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "@/lib/stripe";
import { requireAuth } from "@/lib/auth";
import Organization from "@/modules/org/organization.model";

export default requireAuth(async function handler(
  req: NextApiRequest & { user: any },
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const org = await Organization.findById(req.user.organization);

    if (!org?.stripeCustomerId) {
      return res.status(400).json({ message: "No active subscription" });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: org.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/settings/billing`,
    });

    return res.status(200).json({ url: portalSession.url });
  } catch (err) {
    console.error("Stripe portal error:", err);
    return res.status(500).json({ message: "Unable to open billing portal" });
  }
});
