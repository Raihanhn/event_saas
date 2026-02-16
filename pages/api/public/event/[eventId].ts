//pages/api/public/event/[eventId.ts]

import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Client from "@/modules/clients/client.model";
import Event from "@/modules/events/event.model";
import Budget from "@/modules/budgets/budget.model";
import { Types } from "mongoose";

/* =========================
   TYPES
========================= */

interface LeanClient {
  _id: string;
  name: string;
  organization: string;
}

interface LeanEvent {
  _id: string;
  name: string;
  startDate?: Date;
  endDate?: Date;
  location?: string;
  totalBudget?: number;
}

interface LeanSubcategory {
  name: string;
  estimatedAmount?: number;
  actualAmount?: number;
}

interface LeanBudget {
  _id: string;
  category: string;
  status?: string;
  estimatedAmount?: number;
  actualAmount?: number;
  subcategories?: LeanSubcategory[];
}

/* =========================
   HANDLER
========================= */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await connectDB();

  const { eventId, token } = req.query as {
    eventId: string;
    token: string;
  };

  console.log("🔑 Token received:", token);
  console.log("📌 Event ID:", eventId);

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  if (!Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: "Invalid event ID" });
  }

  /* =========================
     1️⃣ Validate Client
  ========================= */
  const client = await Client.findOne({ accessToken: token })
    .select("_id name organization")
    .lean<LeanClient>();

  console.log("👤 Client:", client);

  if (!client) {
    return res.status(401).json({ message: "Invalid token" });
  }

  /* =========================
     2️⃣ Fetch Event
  ========================= */
  const event = await Event.findOne({
    _id: eventId,
    organization: client.organization,
  })
    .select("name startDate endDate location totalBudget")
    .lean<LeanEvent>();

  console.log("📅 Event:", event);

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  /* =========================
     3️⃣ Fetch Budgets
  ========================= */
  const budgets = await Budget.find({
    event: eventId,
    organization: client.organization,
  })
    .select("category status estimatedAmount actualAmount subcategories")
    .lean<LeanBudget[]>();

  console.log("💰 Budgets:", budgets);

  /* =========================
     4️⃣ Calculate Totals
  ========================= */
  const estimatedBudget = budgets.reduce(
    (sum, b) => sum + (b.estimatedAmount || 0),
    0
  );

  const actualSpent = budgets.reduce(
    (sum, b) => sum + (b.actualAmount || 0),
    0
  );

  const totalBudget = event.totalBudget || 0;
  const remaining = totalBudget - actualSpent;

  console.log("📊 Summary:", {
    totalBudget,
    estimatedBudget,
    actualSpent,
    remaining,
  });

  /* =========================
     5️⃣ Client-safe Budgets
  ========================= */
  const clientBudgets = budgets.map((b) => ({
    _id: b._id,
    category: b.category,
    status: b.status,
    estimatedAmount: b.estimatedAmount || 0,
    actualAmount: b.actualAmount || 0,
    subcategories:
      b.subcategories?.map((s) => ({
        name: s.name,
        estimated: s.estimatedAmount || 0,
        actual: s.actualAmount || 0,
      })) || [],
  }));

  /* =========================
     6️⃣ RESPONSE
  ========================= */
  return res.status(200).json({
    event: {
      _id: event._id,
      name: event.name,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location,
      totalBudget,
    },
    clientName: client.name,
    summary: {
      totalBudget,
      estimatedBudget,
      actualSpent,
      remaining,
    },
    budgets: clientBudgets,
  });
}

