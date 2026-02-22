// modules/org/organization.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IOrganization extends Document {
  name: string;
  businessType?: string;
  country?: string;
  currency?: string;
  timezone?: string;
  website?: string;
  businessSize?: string;
  plan: "free" | "growth" | "studio";
  // stripeCustomerId?: string;
  // stripeSubscriptionId?: string;
  // stripePriceId?: string;
  paddleSubscriptionId?: string;
  paddleProductId?: string;
  admin: mongoose.Types.ObjectId;
}

const OrganizationSchema = new Schema(
  {
    name: { type: String, required: true },
    businessType: String,
    country: String,
    currency: String,
    timezone: String,
    website: String,
    businessSize: String,
    plan: { type: String, default: "free" },
    // stripeCustomerId: String,
    // stripeSubscriptionId: String,
    // stripePriceId: String,
    paddleSubscriptionId: String,
    paddleProductId: String,
    admin: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export default mongoose.models.Organization ||
  mongoose.model<IOrganization>("Organization", OrganizationSchema);
