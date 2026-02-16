//lib/seedTemplates.ts

import Template from "@/modules/templates/template.model";

export async function seedTemplatesForOrg(organization: string) {
  console.log("🌱 seedTemplatesForOrg called for org:", organization);

  const count = await Template.countDocuments({ organization });
  console.log("📦 Existing templates count:", count);

  if (count > 0) {
    console.log("⏭ Templates already exist, skipping seed");
    return false;
  }

  console.log("🚀 Seeding default templates...");

  const templatesData = [
    {
      name: "Wedding Planning",
      eventType: "wedding",
      image: "/seeds/event1.jpg",
      items: [
        { title: "Book Venue", budget: 50000 },
        { title: "Final Checklist", budget: 8000 },
        { title: "Send Thank You Notes", budget: 2000 },
      ],
    },
    {
      name: "Corporate Events",
      eventType: "corporate",
      image: "/seeds/event1.jpg",
      items: [
        { title: "Book Conference Hall", budget: 60000 },
        { title: "Prepare Agendas", budget: 15000 },
        { title: "Distribute Feedback Forms", budget: 3000 },
      ],
    },
    {
      name: "Birthday Party",
      eventType: "birthday",
      image: "/seeds/event2.jpg",
      items: [
        { title: "Book Venue", budget: 15000 },
        { title: "Order Cake", budget: 5000 },
        { title: "Send Invitations", budget: 2000 },
      ],
    },
    {
      name: "Private Gathering",
      eventType: "private",
      image: "/seeds/event1.jpg",
      items: [
        { title: "Arrange Location", budget: 10000 },
        { title: "Prepare Menu", budget: 5000 },
        { title: "Send Invites", budget: 1000 },
      ],
    },
    {
      name: "Product Launch",
      eventType: "product",
      image: "/seeds/event1.jpg",
      items: [
        { title: "Book Launch Venue", budget: 40000 },
        { title: "Prepare Presentation", budget: 10000 },
        { title: "Send Press Releases", budget: 3000 },
      ],
    },
    {
      name: "Conference Event",
      eventType: "conference",
      image: "/seeds/event1.jpg",
      items: [
        { title: "Book Conference Hall", budget: 70000 },
        { title: "Arrange Speakers", budget: 20000 },
        { title: "Distribute Brochures", budget: 5000 },
      ],
    },
  ];

  const phases: Array<"pre-event" | "event-day" | "post-event"> = [
    "pre-event",
    "event-day",
    "post-event",
  ];

  const templatesToInsert = templatesData.map((t) => {
    const mergedItems = t.items.map((item, idx) => ({
      title: item.title,
      phase: phases[idx],
      taskType: "internal",
      dueOffsetDays: idx === 0 ? -2 : idx === 1 ? 0 : 1,
      startTime: idx === 1 ? "10:00" : undefined,
      endTime: idx === 1 ? "18:00" : undefined,
      estimatedAmount: item.budget,
    }));

    return {
      name: t.name,
      eventType: t.eventType,
      image: t.image,
      items: mergedItems,
      organization,
    };
  });

  try {
    await Template.insertMany(templatesToInsert, { ordered: false });
    console.log("✅ Templates seeded successfully");
    return true;
  } catch (err: any) {
    if (err.code !== 11000) throw err;
  }

  return true;
}
