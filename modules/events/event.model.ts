// modules/events/event.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  name: string;
  eventType: "wedding" | "corporate" | "birthday" | "private" | "product" | "conference" | "other";
  // eventDate: Date;
  startDate: Date; // new mandatory start date
  endDate?: Date; // optional end date for multi-day events
  startTime?: string; // optional, e.g., "10:00"
  endTime?: string; // optional, e.g., "18:00"
  isFlexible?: boolean;
  location?: string;

  status: "draft" | "active" | "completed";

  organization: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  clients?: mongoose.Types.ObjectId[]; 
  totalBudget: number; 
}

const EventSchema = new Schema(
  {
    name: { type: String, required: true },

    eventType: {
      type: String,
      enum: ["wedding", "corporate", "birthday", "private", "product", "conference", "other"],
      required: true,
    },

    startDate: { type: Date, required: true },
    endDate: Date,
    startTime: String,
    endTime: String,
    isFlexible: { type: Boolean, default: false },
    location: String,

    status: {
      type: String,
      enum: ["draft", "active", "completed"],
      default: "active",
    },

    organization: {
      type: mongoose.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },

      clients: {
      type: [{ type: mongoose.Types.ObjectId, ref: "Client" }],
      default: [], // default empty array
    },

    totalBudget: {
      type: Number,
      default: 0, // default to 0
    },
  },
  { timestamps: true },
);

export default mongoose.models.Event ||
  mongoose.model<IEvent>("Event", EventSchema);
