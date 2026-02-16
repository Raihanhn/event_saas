//modules/clients/client.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IClient extends Document {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  organization: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  accessToken?: string;
}

const ClientSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    avatar: String,
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    createdBy: {
       type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accessToken: {
      type: String,
      unique: true,
      default: null,
    },
  },
  { timestamps: true }
);

// ✅ Safe Mongoose export
const Client = mongoose.models?.Client || mongoose.model<IClient>("Client", ClientSchema);

export default Client;
