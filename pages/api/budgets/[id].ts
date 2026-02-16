// pages/api/budgets/[id].ts

import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Budget from "@/modules/budgets/budget.model";
import { requireAuth } from "@/lib/auth";
import mongoose, { Types } from "mongoose";

interface AuthUser {
  id: string;
  organization: string;
  role: string;
  permissions?: {
    canEditVendor: boolean;
  };
}

interface AuthRequest extends NextApiRequest {
  user: AuthUser;
}

export default requireAuth(async (req: AuthRequest, res: NextApiResponse) => {
  await connectDB();

  // --------------------------
  // Ensure ID is a string
  // --------------------------
  const { id } = req.query;
  const budgetId = Array.isArray(id) ? id[0] : id;

  if (!budgetId || !Types.ObjectId.isValid(budgetId)) {
    return res.status(400).json({ message: "Invalid budget ID" });
  }

  /* ======================
     UPDATE BUDGET
  ====================== */
  if (req.method === "PATCH") {
    try {
      const { _id, ...payload } = req.body;

      console.log("===== PATCH /api/budgets/[id] =====");
      console.log("URL id:", budgetId);
      console.log("Body received:", payload);
      console.log("Body _id:", _id);
      console.log("User organization:", req.user.organization);

      // Sanitize subcategories and vendors
      if (payload.subcategories) {
        payload.subcategories = payload.subcategories.map((s: any) => ({
          ...s,
          vendors: (s.vendors || [])
            .filter((v: any) => v.vendor && Types.ObjectId.isValid(v.vendor))
            .map((v: any) => ({
              ...v,
              vendor: new Types.ObjectId(v.vendor),
            })),
        }));
      }

      // Attach user organization
      payload.organization = new Types.ObjectId(req.user.organization);

      // Update budget
      const updated = await Budget.findOneAndUpdate(
        {
          _id: new Types.ObjectId(budgetId),
          organization: new Types.ObjectId(req.user.organization),
        },
        { $set: payload },
        { new: true, runValidators: true }
      );

      if (!updated) {
        return res.status(404).json({ message: "Budget not found" });
      }

      console.log("Budget updated:", updated);
      return res.status(200).json(updated);
    } catch (err) {
      console.error("Error updating budget:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  /* ======================
     DELETE BUDGET
  ====================== */
  if (req.method === "DELETE") {
    try {
      const deleted = await Budget.findOneAndDelete({
        _id: new Types.ObjectId(budgetId),
        organization: new Types.ObjectId(req.user.organization),
      });

      if (!deleted) {
        return res.status(404).json({ message: "Budget not found" });
      }

      return res.status(200).json({ message: "Budget deleted" });
    } catch (err) {
      console.error("Error deleting budget:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
});
