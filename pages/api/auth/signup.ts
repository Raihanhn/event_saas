// pages/api/auth/signup.ts
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/modules/users/user.model";
import Organization from "@/modules/org/organization.model";
import { signToken } from "@/lib/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();
    const {
      fullName,
      email,
      password,
      phone,
      businessName,
      businessType,
      country,
      currency,
      timezone,
      website,
      businessSize,
      plan,
    } = req.body;

    if (!fullName || !email || !password || !businessName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const organization = await Organization.create({
      name: businessName,
      businessType,
      country,
      currency,
      timezone,
      website,
      businessSize,
      plan: plan || "free",
    });

    const user = await User.create({
      name: fullName,
      email,
      password: hashedPassword,
      phone,
      role: "admin",
      organization: organization._id,
    });

    organization.admin = user._id;
    await organization.save();

    const token = signToken({
      userId: user._id,
      orgId: organization._id,
      role: user.role,
      permissions: user.permissions,
    });

    // Set cookie
res.setHeader(
  "Set-Cookie",
  `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${process.env.NODE_ENV === "production" ? "; Secure" : ""}`
);

    return res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
        permissions: user.permissions,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}
