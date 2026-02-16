// modules/templates/template.model.ts

import mongoose, { Schema, Document } from "mongoose";

export type TemplateItem = {
  title: string;
  phase: "pre-event" | "event-day" | "post-event";
  taskType: "vendor" | "client" | "budget" | "internal";
  dueOffsetDays?: number;
  startTime?: string; // optional
  endTime?: string;   // optional
  estimatedAmount?: number; // merged budget
};

export interface ITemplate extends Document {
  name: string;
  eventType: "wedding" | "corporate" | "private" | "birthday" | "product" | "conference" | "other";
  items: TemplateItem[];  // merged array
  image?: string;
  organization: mongoose.Types.ObjectId;
}

const TemplateSchema = new Schema(
  {
    name: { type: String, required: true },
    eventType: { type: String, required: true },

    organization: { type: mongoose.Types.ObjectId, ref: "Organization", required: true },

    items: [
      {
        title: { type: String, required: true },
        phase: { type: String, enum: ["pre-event", "event-day", "post-event"], required: true },
        taskType: { type: String, enum: ["vendor", "client", "budget", "internal"], required: true },
        dueOffsetDays: Number,
        startTime: String,
        endTime: String,
        estimatedAmount: Number, // merged budget
      },
    ],

    image: String,
  },
  { timestamps: true }
);

// Ensure unique per org + template name
TemplateSchema.index({ name: 1, organization: 1 }, { unique: true });

export default mongoose.models.Template ||
  mongoose.model<ITemplate>("Template", TemplateSchema);
