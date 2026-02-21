//pages/api/budgets/vendor-overview.ts
import { connectDB } from "@/lib/mongodb";
import Budget from "@/modules/budgets/budget.model";
import { requireAuth } from "@/lib/auth";
import "@/modules/vendors/vendor.model";


export default requireAuth(async (req: any, res: any) => {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    await connectDB();

    if (!req.user || !req.user.organization) {
      return res.status(401).json({ message: "Unauthorized" });
    }

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
          if (!v.vendor) return; // 🔒 PREVENT CRASH

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
  } catch (err) {
    console.error("Vendor overview error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});  

