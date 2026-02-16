import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";

import Event from "@/modules/events/event.model";
import Template, { TemplateItem } from "@/modules/templates/template.model";
import Task from "@/modules/tasks/task.model";
import Budget from "@/modules/budgets/budget.model";

interface AuthUser {
  id: string;
  organization: string;
  role: string;
  permissions?: { canEditVendor: boolean };
}

interface CreateEventBody {
  name: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  isFlexible?: boolean;
  location?: string;
  templateId?: string;
  clientIds?: string[];
  totalBudget?: number;
  items?: any[]; // ← custom table rows
}

// Typed template for merged items
interface TemplateWithItems {
  _id: string;
  eventType: string;
  organization: string;
  items: TemplateItem[];
}

async function handler(
  req: NextApiRequest & { user: AuthUser },
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const {
      name,
      startDate,
      endDate,
      startTime,
      endTime,
      isFlexible,
      location,
      templateId,
      clientIds,
      totalBudget,
      items, // ← receive custom items from frontend
    }: CreateEventBody = req.body;

    if (!name || !startDate) {
      return res
        .status(400)
        .json({ message: "Name and event date are required" });
    }

    console.log("🚀 Create Event Request Body:", req.body);

    let eventType: string = "other";
    let template: TemplateWithItems | null = null;

    if (templateId) {
      template = await Template.findOne({
        _id: templateId,
        organization: req.user.organization,
      })
        .select("_id eventType organization items")
        .lean<TemplateWithItems>();

      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      eventType = template.eventType;
    }

    // Create Event
    const event = await Event.create({
      name,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      startTime,
      endTime,
      isFlexible,
      location: location || "",
      eventType,
      organization: req.user.organization,
      createdBy: req.user.id,
      clients: clientIds || [],
      totalBudget: totalBudget || 0,
    });

    console.log("🎉 Event Created:", event._id.toString());

    // -------------------
    // Handle Tasks & Budgets
    // -------------------
    let tasksToInsert: any[] = [];
    let budgetsToInsert: any[] = [];

    if (template && template.items) {
      // Clone tasks/budgets from template
      tasksToInsert = template.items
        .filter((i) => i.taskType !== "budget")
        .map((i: TemplateItem) => {
          let dueDate: Date | undefined;
          if (typeof i.dueOffsetDays === "number") {
            dueDate = new Date(startDate);
            dueDate.setDate(dueDate.getDate() + i.dueOffsetDays);
          }
          return {
            title: i.title,
            phase: i.phase,
            taskType: i.taskType,
            dueDate,
            startTime: i.startTime,
            endTime: i.endTime,
            event: event._id,
            organization: req.user.organization,
          };
        });

      budgetsToInsert = template.items
        .filter((i) => i.taskType === "budget" || i.estimatedAmount)
        .map((i: TemplateItem) => ({
          category: i.title,
          estimatedAmount: i.estimatedAmount ?? 0,
          actualAmount: 0,
          event: event._id,
          status: "pending",
          organization: req.user.organization,
        }));
    } else if (items && items.length > 0) {
      // Handle custom items
      console.log("📝 Custom Items Received:", items);

      tasksToInsert = items.map((i: any) => ({
        title: i.title,
        phase: i.phase,
        taskType: "custom",
        dueDate: i.dueDate ? new Date(i.dueDate) : undefined,
        startTime: i.startTime || "",
        endTime: i.endTime || "",
        isFlexible: i.isFlexible || false,
        vendors: i.vendors || [],
        event: event._id,
        organization: req.user.organization,
      }));

      budgetsToInsert = items.map((i: any) => ({
        category: i.title,
        estimatedAmount: i.estimatedAmount ?? 0,
        actualAmount: i.actualAmount ?? 0,
        status: i.status || "pending",
        vendors: i.vendors || [],
        event: event._id,
        organization: req.user.organization,
      }));
    }

    // Insert tasks & budgets
    const createdTasks =
      tasksToInsert.length > 0 ? await Task.insertMany(tasksToInsert) : [];
    const createdBudgets =
      budgetsToInsert.length > 0 ? await Budget.insertMany(budgetsToInsert) : [];

    // Merge for frontend table
    const mergedItems = (createdTasks || []).map((t) => {
      const b = createdBudgets.find((b) => b.category === t.title);
      return {
        _id: t._id.toString(),
        budgetId: b?._id.toString() || null,
        title: t.title,
        phase: t.phase,
        status: t.status || "pending",
        dueDate: t.dueDate ? t.dueDate.toISOString() : null,
        startTime: t.startTime || "",
        endTime: t.endTime || "",
        isFlexible: t.isFlexible || false,
        vendors: t.vendors ? t.vendors.map((v: any) => v.toString()) : [],
        estimatedAmount: b?.estimatedAmount ?? null,
        actualAmount: b?.actualAmount ?? null,
        event: event._id.toString(),
      };
    });

    console.log("📋 Merged Items for frontend table:", mergedItems);

    return res.status(201).json({ event, items: mergedItems });
  } catch (error) {
    console.error("❌ Error creating event:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export default requireAuth(handler);
