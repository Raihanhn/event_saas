// dashboard/events/create.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GetServerSideProps } from "next";
import { connectDB } from "@/lib/mongodb";
import TemplateModel, { ITemplate } from "@/modules/templates/template.model";
import TemplatePickerModal from "@/modules/events/ui/TemplatePickerModal";
import SelectedTemplatePreview from "@/modules/events/ui/SelectedTemplatePreview";
import CustomEventFields from "@/modules/events/ui/CustomEventFields";
import { requireAuthServerSide } from "@/lib/auth";
import { seedTemplatesForOrg } from "@/lib/seedTemplates";
import Select from "react-select";
import { EventItem } from "@/modules/events/ui/EventItemTable";

interface CreateEventPageProps {
  templates: ITemplate[];
}

interface Client {
  _id: string;
  name: string;
  avatar?: string; // optional
}

export default function CreateEventPage({ templates }: CreateEventPageProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isFlexible, setIsFlexible] = useState(false);
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);
  const [location, setLocation] = useState("");
  const [mode, setMode] = useState<"custom" | "template">("custom");
  const [items, setItems] = useState<EventItem[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ITemplate | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
  const fetchClients = async () => {
    const res = await fetch("/api/clients");
    if (res.ok) {
      const data = await res.json();
      console.log("Clients API data:", data);

      // Fix: data itself is array
      const clientList: Client[] = data.map((c: any) => ({
        _id: c._id,
        name: c.name,
        avatar: c.avatar || "/default-avatar.png",
      }));

      console.log("Clients:", clientList);
      setClients(clientList);
    }
  };
  fetchClients();
}, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/events/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        startDate,
        endDate: endDate || undefined,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        isFlexible,
        location,
        templateId: mode === "template" ? selectedTemplate?._id : undefined,
        totalBudget,
        // clientIds: selectedClients,
        clientIds: selectedClients.map(c => c._id),
        items: mode === "custom" ? items : undefined,
      }),
    });

    if (!res.ok) {
      alert("Failed to create event");
      return;
    }

    const data = await res.json();
    router.push(`/dashboard/events/${data.event._id}`);
  };

  console.log("Clients:", clients);
  console.log("Selected Clients:", selectedClients);

  return (
    <div className="p-6 h-screen mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Create Event</h1>

      {/* Event Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border border-gray-300 focus:outline-none px-3 py-2 rounded"
          placeholder="Event Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label className="block text-sm text-gray-600 mb-1">Total Budget</label>
        <input
          type="number"
          value={totalBudget}
          onChange={(e) => setTotalBudget(Number(e.target.value))}
          placeholder="Enter total budget"
          className="w-full border border-gray-300 focus:outline-none px-3 py-2 rounded"
        />
           <label className="block text-sm text-gray-600 mb-1">
              Select Client
            </label>
        <Select
          isMulti
          options={clients.map((c) => ({ value: c._id, label: c.name }))}
          value={selectedClients.map((c) => ({ value: c._id, label: c.name }))}
          onChange={(selected) => {
            setSelectedClients(
              selected
                ? selected.map((s) => clients.find((c) => c._id === s.value)!)
                : [],
            );
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Start Date & Time
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 focus:outline-none px-2 py-1 rounded mb-1"
              required
            />
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border border-gray-300 focus:outline-none px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              End Date & Time
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 focus:outline-none px-2 py-1 rounded mb-1"
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border border-gray-300 focus:outline-none px-2 py-1 rounded"
            />
          </div>
        </div>

        <label className="flex items-center space-x-2 mt-2">
          <input
            type="checkbox"
            checked={isFlexible}
            onChange={(e) => setIsFlexible(e.target.checked)}
            className="form-checkbox"
          />
          <span>Flexible Timing</span>
        </label>

        <input
          className="w-full border border-gray-300 focus:outline-none px-3 py-2 rounded"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        {/* Template Selection */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => {
              setMode("custom");
              setSelectedTemplate(null);
            }}
            className={`px-4 py-2 rounded border border-gray-300 transition transform hover:scale-105 cursor-pointer ${
              mode === "custom" ? "bg-gray-200" : ""
            }`}
          >
            Custom Event
          </button>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className={`px-4 py-2 rounded border transition transform hover:scale-105 cursor-pointer ${
              mode === "template" ? " bg-[#3B82F6] text-white" : ""
            }`}
          >
            Choose Template
          </button>
        </div>

        {mode === "template" && selectedTemplate && (
          <SelectedTemplatePreview template={selectedTemplate} />
        )}

        {mode === "custom" && (
  <CustomEventFields items={items} setItems={setItems} />
)}

        <button className="px-4 py-2 transition transform hover:scale-105 cursor-pointer rounded-lg bg-[#3B82F6] text-white rounded hover:bg-[#2563EB]">
          Create Event
        </button>
      </form>

      {/* Template Modal */}
      <TemplatePickerModal
        open={modalOpen}
        templates={templates}
        onClose={() => setModalOpen(false)}
        onSelect={(template: ITemplate) => {
          setSelectedTemplate(template);
          setMode("template");
          setModalOpen(false);
        }}
      />
        <div className="h-56"></div>
    </div>
  );
}

// ======================
// SSR: Fetch Templates
// ======================

export const getServerSideProps: GetServerSideProps = requireAuthServerSide(
  async (context) => {
    await connectDB();

    const orgId = context.user!.organization;

    console.log("🧩 Create Event page SSR for org:", orgId);

    // 🔥 ensure templates exist
    const seeded = await seedTemplatesForOrg(orgId);
    console.log("🌱 Seed result:", seeded ? "CREATED" : "ALREADY EXISTS");

    const templates = await TemplateModel.find({
      organization: orgId,
    })
      .select("_id name eventType image")
      .lean<ITemplate[]>();

    console.log("📄 Templates fetched:", templates.length);

    return {
      props: {
        templates: templates.map((t) => ({
          _id: t._id.toString(),
          name: t.name,
          eventType: t.eventType,
          image: t.image || null,
        })),
      },
    };
  },
);
