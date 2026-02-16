//pages/api/budgets/vendor-overview.ts
import { connectDB } from "@/lib/mongodb";
import Budget from "@/modules/budgets/budget.model";
import { requireAuth } from "@/lib/auth";

export default requireAuth(async (req: any, res: any) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await connectDB();

  const { eventId } = req.query;
  if (!eventId) {
    return res.status(400).json({ message: "Event ID required" });
  }

  const budgets = await Budget.find({
    event: eventId,
    organization: req.user.organization,
  })
    .populate("subcategories.vendors.vendor", "name avatar")
    .lean();

  const rows: any[] = [];

  budgets.forEach((b) => {
    b.subcategories?.forEach((s: any) => {
      s.vendors?.forEach((v: any) => {
        rows.push({
          vendorId: v.vendor._id,
          name: v.vendor.name,
          avatar: v.vendor.avatar,
          task: s.name,
          totalCost: s.actualAmount || 0,
          paid: v.amount || 0,
          budgetId: b._id,
          subcategoryName: s.name,
        });
      });
    });
  });

  return res.status(200).json(rows);
});
