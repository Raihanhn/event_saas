"use client";

import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { connectDB } from "@/lib/mongodb";
import { requireAuthServerSide } from "@/lib/auth";
import EventModel, { IEvent } from "@/modules/events/event.model";
import TaskModel, { ITask } from "@/modules/tasks/task.model";
import BudgetModel, { IBudget } from "@/modules/budgets/budget.model";
import EventInfo, { EventData } from "@/modules/events/ui/EventInfo";
import { Client } from "@/modules/events/ui/ClientsDisplay";
import { Types } from "mongoose";
import EventCard from "@/modules/events/ui/EventCards";
import EventItemTable, { EventItem, VendorOption } from "@/modules/events/ui/EventItemTable";

interface EventDetailsProps {
  event: EventData;
  items: EventItem[];
}

export default function EventDetails({ event, items: initialItems }: EventDetailsProps) {
  const [items, setItems] = useState<EventItem[]>(initialItems);
  const [editMode, setEditMode] = useState(false);
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [allVendors, setAllVendors] = useState<VendorOption[]>([]);
  const [eventData, setEventData] = useState<EventData>(event);

  const updateItem = (id: string, field: keyof EventItem | "add", value: any) => {
    if (field === "add") setItems((prev) => [...prev, value]);
    else setItems((prev) => prev.map((i) => (i._id === id ? { ...i, [field]: value } : i)));
  };

  // Fetch clients & vendors including avatars
  useEffect(() => {
    async function fetchClientsAndVendors() {
      try {
        const [clientsRes, vendorsRes] = await Promise.all([fetch("/api/clients"), fetch("/api/vendors")]);
        const clientsData = await clientsRes.json();
        const vendorsData = await vendorsRes.json();

        setAllClients(
          Array.isArray(clientsData)
            ? clientsData.map((c: any) => ({ _id: c._id, name: c.name, avatar: c.avatar || "/avatar/avatar.jpg" }))
            : []
        );

        setAllVendors(
          Array.isArray(vendorsData)
            ? vendorsData.map((v: any) => ({ label: v.name, value: v._id, avatar: v.avatar || "/vendor-default.png" }))
            : []
        );
      } catch (err) {
        console.error(err);
      }
    }

    fetchClientsAndVendors();
  }, []);

  const saveChanges = async () => {
  try {
    // Update Event
    await fetch(`/api/events/${eventData._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });

    // Update Tasks & Budgets
    await Promise.all(
      items.map(async (i) => {
        const taskPayload = {
          title: i.title,
          phase: i.phase,
          status: i.status,
          dueDate: i.dueDate,
          startTime: i.startTime,
          endTime: i.endTime,
          isFlexible: i.isFlexible,
          vendors: i.vendors || [],
          event: eventData._id,
        };

        const budgetPayload = {
          category: i.title,
          estimatedAmount: i.estimatedAmount ?? 0,
          actualAmount: i.actualAmount ?? 0,
          status: i.status,
          vendors: i.vendors || [],
          event: eventData._id,
        };

        if (i._id.startsWith("temp-")) {
          // New Task
          const tRes = await fetch("/api/tasks/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskPayload),
          });
          const tData = await tRes.json();
          i._id = tData._id;

          await fetch("/api/budgets/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(budgetPayload),
          });
        } else {
          // Existing Task
          await fetch(`/api/tasks/${i._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskPayload),
          });

          // await fetch(`/api/budgets/${i._id}`, {
          //   method: "PATCH",
          //   headers: { "Content-Type": "application/json" },
          //   body: JSON.stringify(budgetPayload),
          // });

          // PATCH budget using correct budgetId
if (i.budgetId) {
  await fetch(`/api/budgets/${i.budgetId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(budgetPayload),
  });
} else {
  // if budget doesn’t exist yet, create it
  const bRes = await fetch("/api/budgets/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(budgetPayload),
  });
  const bData = await bRes.json();
  i.budgetId = bData._id;
}

        }
      })
    );

    alert("Changes saved successfully!");
    setEditMode(false);
  } catch (err) {
    console.error(err);
    alert("Failed to save changes.");
  }
};


  return (
    <div className="p-6 space-y-6">
      <EventInfo eventData={eventData} setEventData={setEventData} editMode={editMode} setEditMode={setEditMode} saveChanges={saveChanges}   allClients={allClients} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <EventCard label="Start Date & Time" value={eventData.startDate} timeValue={eventData.startTime} editMode={editMode} onChange={(v, t) => setEventData({ ...eventData, startDate: v, startTime: t })} color="#10B981" />
        <EventCard label="End Date & Time" value={eventData.endDate} timeValue={eventData.endTime} editMode={editMode} onChange={(v, t) => setEventData({ ...eventData, endDate: v, endTime: t })} color="#EC4899" />
        <EventCard label="Flexible Timing" isCheckbox checked={eventData.isFlexible} editMode={editMode} onChange={(checked) => setEventData({ ...eventData, isFlexible: checked })} color="#3B82F6" />
        <EventCard label="Location" value={eventData.location || ""} editMode={editMode} onChange={(v) => setEventData({ ...eventData, location: v })} color="#F54927" />
        <EventCard label="Status" selectOptions={["pending", "in-progress", "completed"]} value={eventData.status} editMode={editMode} onChange={(v) => setEventData({ ...eventData, status: v })} color="#4338CA" />
        <EventCard label="Total Budget" value={eventData.totalBudget} editMode={editMode} onChange={(v) => setEventData({ ...eventData, totalBudget: Number(v || 0) })} color="#FBBF24" isNumber />
      </div>

      <EventItemTable items={items} editMode={editMode} updateItem={updateItem} allVendors={allVendors} />
    </div>
  );
}

// --------------------------
// SSR: Fetch Event & Merge Tasks/Budgets
// --------------------------
export const getServerSideProps: GetServerSideProps =
  requireAuthServerSide<EventDetailsProps>(async (context) => {
    await connectDB();
    const eventId = context.params?.id as string;
    if (!Types.ObjectId.isValid(eventId)) return { notFound: true };

    const event = await EventModel.findOne({ _id: eventId, organization: context.user!.organization }).populate("clients").lean<IEvent>();
    if (!event) return { notFound: true };

    const tasks = await TaskModel.find({ event: event._id }).lean<ITask[]>();
    const budgets = await BudgetModel.find({ event: event._id }).lean<IBudget[]>();

    const mergedItems: EventItem[] = tasks.map((t) => {
  const b = budgets.find(b => b.category === t.title);
  return {
    _id: t._id.toString(),
    budgetId: b?._id.toString() || null, // ← add this
    title: t.title,
    phase: t.phase,
    status: t.status,
    dueDate: t.dueDate ? t.dueDate.toISOString() : null,
    startTime: t.startTime || "",
    endTime: t.endTime || "",
    isFlexible: t.isFlexible || false,
    vendors: t.vendors ? t.vendors.map((v) => v.toString()) : [],
    estimatedAmount: b?.estimatedAmount ?? null,
    actualAmount: b?.actualAmount ?? null,
    event: event._id.toString(),
  };
});


    return {
      props: {
        event: {
          _id: event._id.toString(),
          name: event.name,
          eventType: event.eventType,
          startDate: event.startDate ? event.startDate.toISOString() : "",
          startTime: event.startTime || "",
          endDate: event.endDate ? event.endDate.toISOString() : "",
          endTime: event.endTime || "",
          isFlexible: event.isFlexible || false,
          location: event.location ?? null,
          status: event.status,
          totalBudget: event.totalBudget ?? 0,
          clients: event.clients?.map((c: any) => ({ _id: c._id.toString(), name: c.name, avatar: c.avatar || "/default-avatar.png" })) || [],
        },
        items: mergedItems,
      },
    };
  });
