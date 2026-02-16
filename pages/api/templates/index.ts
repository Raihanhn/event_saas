// pages/api/templates/index.ts
import { connectDB } from "@/lib/mongodb";
import Template from "@/modules/templates/template.model";
import { requireAuth } from "@/lib/auth";

export default requireAuth(async (req, res) => {
  await connectDB();
  const templates = await Template.find({
    organization: req.user.organization,
  }).select("_id name eventType");

  console.log("Templates query for organization:", req.user.organization);
  console.log("Found templates:", templates);


  res.json(templates);
});
