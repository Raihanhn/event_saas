// modules/tasks/task.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;

  dueDate?: Date;       // main date
  startTime?: string;   // optional
  endTime?: string;     // optional
  isFlexible?: boolean; // optional
  phase: "pre-event" | "event-day" | "post-event";
  taskType: "vendor" | "client" | "budget" | "internal";

  status: "pending" | "in-progress" | "completed";

  event: mongoose.Types.ObjectId;
  organization: mongoose.Types.ObjectId;
  vendors?: mongoose.Types.ObjectId[]; 
  assignedTo?: mongoose.Types.ObjectId;
}

const TaskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,

    dueDate: Date,
    startTime: String,
    endTime: String,
    isFlexible: { type: Boolean, default: false },

    phase: { type: String, required: true },
    taskType: { type: String, required: true },

    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },

    event: {
      type: mongoose.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    organization: { type: mongoose.Types.ObjectId, ref: "Organization", required: true },

     vendors: [{ type: mongoose.Types.ObjectId, ref: "Vendor" }],
    assignedTo: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Task ||
  mongoose.model<ITask>("Task", TaskSchema);
