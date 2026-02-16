// lib/stripe.ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // apiVersion: "2025-12-15.clover",
  apiVersion: "2026-01-28.clover",
});

export const STRIPE_PRICE_IDS: Record<string, string> = {
  free: "",
  growth: "price_1SqoOjDuDFAFM6tLnCn9JSZU",
  studio: "price_1SqoPmDuDFAFM6tLDrRhQclb",
};
