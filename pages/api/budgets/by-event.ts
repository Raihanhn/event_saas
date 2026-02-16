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

  // 🔒 Admin-only
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const budgets = await Budget.find({
    event: eventId,
    organization: req.user.organization,
  }).sort({ createdAt: 1 });

  return res.status(200).json(budgets);
});
