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
  paddleCustomerId?: string;
  paddleSubscriptionId?: string;
  paddlePriceId?: string;
  subscriptionStatus?: "active" | "canceled" | "past_due" | null;
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
   paddleCustomerId: String,
    paddleSubscriptionId: String,
    paddlePriceId: String,
    subscriptionStatus: { type: String, enum: ["active", "canceled", "past_due", null], default: null },
    admin: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export default mongoose.models.Organization ||
  mongoose.model<IOrganization>("Organization", OrganizationSchema);
