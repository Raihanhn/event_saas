// modules/users/user.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
   phone?: string;
  location?: string;
  role: "admin" | "team" | "client";
  organization: mongoose.Types.ObjectId;
   permissions: {
    canEditVendor: boolean;
  };
  profileImage: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  location: { type: String },
  role: { type: String, enum: ["admin", "team", "client"], default: "admin" },
  organization: { type: mongoose.Types.ObjectId, ref: "Organization", required: true },
  permissions: {
      canEditVendor: { type: Boolean, default: false },
    },
  profileImage: { type: String, default: null }, 
  themePreference: { type: String, enum: ["light", "dark"], default: "light" },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
