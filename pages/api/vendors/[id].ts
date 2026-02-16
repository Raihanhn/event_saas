//pages/api/vendors/[id].ts
import { connectDB } from "@/lib/mongodb";
import Vendor from "@/modules/vendors/vendor.model";
import User from "@/modules/users/user.model";
import { requireAuth } from "@/lib/auth";

export default requireAuth(async (req: any, res: any) => {
  await connectDB();
  const user = await User.findById(req.user.id);

  if (req.method === "PUT") {
    if (user.role !== "admin" && !user.permissions.canEditVendor) {
      return res.status(403).end();
    }

    if (user.role !== "admin") {
      delete req.body.email; // 🔐 team cannot edit email
    }

    const vendor = await Vendor.findByIdAndUpdate(
      req.query.id,
      req.body,
      { new: true }
    );

    return res.json(vendor);
  }

  if (req.method === "DELETE") {
    if (user.role !== "admin") {
      return res.status(403).end();
    }

    await Vendor.findByIdAndDelete(req.query.id);
    return res.json({ success: true });
  }

  res.status(405).end();
});
