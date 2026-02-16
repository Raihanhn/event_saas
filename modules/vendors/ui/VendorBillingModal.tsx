"use client";

import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; 
import "jspdf-autotable";

interface VendorBillingModalProps {
  vendor: any;
  onClose: () => void;
}

interface EventItem {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  budgets?: any[];
}

export default function VendorBillingModal({ vendor, onClose }: VendorBillingModalProps) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const selectedEvent = events.find((e) => e._id === selectedEventId);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events?includeBudgets=true"); // you can create an endpoint that returns events with budgets
        const data = await res.json();
          console.log("Fetched events:", data);
        setEvents(data);
        if (data.length > 0) setSelectedEventId(data[0]._id);
      } catch (err) {
        console.error("Failed to fetch events", err);
      }
    }
    fetchEvents();
  }, []);

  const generatePDF = () => {

      console.log(">>> Generating PDF for vendor:", vendor);
    console.log("Selected event:", selectedEvent);

    if (!selectedEvent) return alert("Please select an event");

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Planovae", 14, 20); // SaaS name
    doc.setFontSize(14);
    doc.text(`Billing Invoice for ${vendor.name}`, 14, 30);
    doc.setFontSize(11);
    doc.text(`Event: ${selectedEvent.name}`, 14, 40);
    doc.text(
      `Start Date: ${selectedEvent.startDate || "—"}`,
      14,
      46
    );
    doc.text(`End Date: ${selectedEvent.endDate || "—"}`, 14, 52);

    // Prepare table
    const tableData: any[] = [];
    selectedEvent.budgets?.forEach((b: any) => {
      b.subcategories?.forEach((sub: any) => {
        sub.vendors?.forEach((v: any) => {
          if (v.vendor._id.toString() === vendor._id.toString()) {
            tableData.push([
              b.category || "—",
              sub.name,
              `$${sub.actualAmount}`,
              `$${v.amount}`,
              `$${sub.actualAmount - v.amount}`,
            ]);

             console.log("Row added:", [
          b.category,
          sub.name,
          sub.actualAmount,
          v.amount,
          (sub.actualAmount || 0) - (v.amount || 0),
        ]);

          }
        });
      });
    });

    if (tableData.length === 0) {
      tableData.push(["—", "—", "—", "—", "—"]);
    }

      // ✅ Log the table data before creating PDF
  console.log("Table data to be used in PDF:");
  tableData.forEach((row, index) => {
    console.log(`Row ${index + 1}:`, row);
  });

  // Ask user if they want to proceed
  const proceed = confirm(
    `Check the console for PDF data. Proceed to download PDF for ${vendor.name}?`
  );
  if (!proceed) return;


   autoTable(doc, {
      startY: 60,
      head: [["Category", "Subcategory", "Total", "Paid", "Due"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [139, 92, 246] },
    });

    doc.save(`Invoice-${vendor.name}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold">Generate Billing</h2>

        <label className="block text-sm text-gray-600">Select Event</label>
        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
        >
          {events.map((e) => (
            <option key={e._id} value={e._id}>
              {e.name}
            </option>
          ))}
        </select>

        <button
          onClick={generatePDF}
          className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-lg w-full transition"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
