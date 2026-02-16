// pages/api/teams/create.ts
import { connectDB } from "@/lib/mongodb";
import User from "@/modules/users/user.model";
import bcrypt from "bcryptjs";
import { requireAuth } from "@/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default requireAuth(async function handler(
  req: NextApiRequest & { user?: any },
  res: NextApiResponse
) {
  if (req.user!.role !== "admin") {
    return res.status(403).json({ message: "Only admin allowed" });
  }

  const { name, email, phone, location, password } = req.body;

  await connectDB();

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(409).json({ message: "Email already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const team = await User.create({
    name,
    email,
    phone,
    location,
    password: hashed,
    role: "team",
    organization: req.user!.organization,
  });

  res.status(201).json(team);
});
