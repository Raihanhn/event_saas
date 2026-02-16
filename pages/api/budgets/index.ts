// pages/api/budgets/index.ts
import { connectDB } from "@/lib/mongodb";
import Budget from "@/modules/budgets/budget.model";
import { requireAuth } from "@/lib/auth";

export default requireAuth(async (req: any, res: any) => {
  await connectDB();

  const { eventId } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const query: any = { organization: req.user.organization };
    if (eventId) query.event = eventId;

    const budgets = await Budget.find(query)
      .sort({ createdAt: 1 })
      .lean(); // lean() for fast read

    return res.status(200).json(budgets);
  } catch (err) {
    console.error("Error fetching budgets:", err);
    return res.status(500).json({ message: "Server error" });
  }
});
