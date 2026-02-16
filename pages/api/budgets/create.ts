// pages/api/budgets/create.ts

import { connectDB } from "@/lib/mongodb";
import Budget from "@/modules/budgets/budget.model";
import { requireAuth } from "@/lib/auth";
import mongoose from "mongoose";

export default requireAuth(async (req: any, res: any) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await connectDB();

  try {
    const body = req.body;

    console.log("CREATE BUDGET - Body received:", body);
    console.log("User org:", req.user.organization);

    // 🔑 Convert vendor IDs to ObjectIds (same as Task API)
    const vendors = body.vendors?.map(
      (v: string) => new mongoose.Types.ObjectId(v)
    );

    console.log("Converted vendors:", vendors);

    const budget = await Budget.create({
      ...body,
      vendors,
      organization: req.user.organization,
      status: body.status || "pending",
    });

    return res.status(201).json(budget);
  } catch (err) {
    console.error("Error creating budget:", err);
    return res.status(500).json({ message: "Server error" });
  }
});
