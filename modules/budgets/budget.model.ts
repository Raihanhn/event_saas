// modules/budgets/budget.model.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IBudgetSubcategoryVendor {
  vendor: mongoose.Types.ObjectId;
  amount: number;
}

export interface IBudgetSubcategory {
  name: string;
  estimatedAmount?: number;
  actualAmount?: number;
  vendors?: IBudgetSubcategoryVendor[];
}

export interface IBudget extends Document {
  event: mongoose.Types.ObjectId;
  category: string;
  estimatedAmount?: number;
  actualAmount?: number;
  status: "pending" | "approved" | "paid";
  organization: mongoose.Types.ObjectId;
  vendors?: mongoose.Types.ObjectId[]; 
  subcategories?: IBudgetSubcategory[];
  createdAt: Date;
  updatedAt: Date;
}

const SubcategoryVendorSchema = new Schema({
  vendor: { type: mongoose.Types.ObjectId, ref: "Vendor", required: true },
  amount: { type: Number, default: 0 },
});

const SubcategorySchema = new Schema({
  name: { type: String, required: true },
  estimatedAmount: { type: Number, default: 0 },
  actualAmount: { type: Number, default: 0 },
  vendors: [SubcategoryVendorSchema],
});

const BudgetSchema = new Schema(
  {
    event: { type: mongoose.Types.ObjectId, ref: "Event", required: true },
    category: { type: String, required: true },
    estimatedAmount: { type: Number, default: 0 },
    actualAmount: { type: Number, default: 0 },
    subcategories: [SubcategorySchema],
    status: {
      type: String,
      enum: ["pending", "approved", "paid"],
      default: "pending",
    },
    organization: { type: mongoose.Types.ObjectId, ref: "Organization", required: true },
    vendors: [{ type: mongoose.Types.ObjectId, ref: "Vendor" }], 
  },
  { timestamps: true } 
);

export default mongoose.models.Budget ||
  mongoose.model<IBudget>("Budget", BudgetSchema);
