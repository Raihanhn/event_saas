// pages/api/templates/seed.ts


import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";
import { seedTemplatesForOrg } from "@/lib/seedTemplates";

export default requireAuth(async (req, res) => {
  await connectDB();

  const created = await seedTemplatesForOrg(req.user.organization);

  res.json({
    message: created
      ? "Templates seeded successfully"
      : "Templates already exist",
  });
});
