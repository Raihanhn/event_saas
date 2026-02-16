//modules/vendors/vendor.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IVendor extends Document {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role?: string;
  organization: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
}

const VendorSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    avatar: String,
    role: {
      type: String,
      trim: true,
      default: null, 
    },

    organization: {
      type: mongoose.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Vendor ||
  mongoose.model<IVendor>("Vendor", VendorSchema);
