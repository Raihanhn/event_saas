// pages/api/profile/update.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";
import User from "@/modules/users/user.model";
import formidable, { File as FormidableFile } from "formidable";
import fs from "fs";
import path from "path";

// Connect to DB
connectDB();

// Disable default body parsing
export const config = { api: { bodyParser: false } };

// Helper to move uploaded file
const moveFile = (file: FormidableFile, dest: string): Promise<string> =>
  new Promise((resolve, reject) => {
    fs.readFile(file.filepath, (err, data) => {
      if (err) return reject(err);
      fs.writeFile(dest, data, (err2) => {
        if (err2) return reject(err2);
        fs.unlinkSync(file.filepath);
        resolve(dest);
      });
    });
  });

// Formidable parser
const parseForm = (req: NextApiRequest) =>
  new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
    const form = formidable({ multiples: false, keepExtensions: true });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

interface AuthRequest extends NextApiRequest {
  user?: { id: string; role: "admin" | "team" };
}

const handler = async (req: AuthRequest, res: NextApiResponse) => {
  if (req.method !== "PUT") return res.status(405).json({ message: "Method Not Allowed" });

  const userId = req.user!.id;

  try {
    const { fields, files } = await parseForm(req);

    // Parse JSON data
    let data: any = {};
    if (fields.data) {
      try {
        const rawData = Array.isArray(fields.data) ? fields.data[0] : fields.data;
        data = JSON.parse(rawData);
      } catch (err) {
        return res.status(400).json({ message: "Invalid data format" });
      }
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update fields
    if (data.name !== undefined) user.name = data.name;
    if (data.phone !== undefined) user.phone = data.phone;
    if (data.location !== undefined) user.location = data.location;

    // Handle profile image
    if (files.profileImage) {
      const file = Array.isArray(files.profileImage)
        ? (files.profileImage[0] as FormidableFile)
        : (files.profileImage as FormidableFile);

      const safeName = (file.originalFilename || "profile.png").replace(/[^a-zA-Z0-9.-]/g, "_");
      const fileName = `${Date.now()}-${safeName}`;
      const uploadDir = path.join(process.cwd(), "public/uploads/profiles");

      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const dest = path.join(uploadDir, fileName);
      await moveFile(file, dest);

      // Save new profile image path (no query string)
      user.profileImage = `/uploads/profiles/${fileName}`;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        role: user.role,
        profileImage: user.profileImage || null,
      },
    });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

export default requireAuth(handler);
