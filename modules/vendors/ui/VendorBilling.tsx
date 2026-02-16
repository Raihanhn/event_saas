// modules/vendors/ui/VendorBilling.tsx


"use client";

import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface VendorBillingProps {
  vendor: any;
  event: any;
  budgets: any[];
}

export default function VendorBilling({ vendor, event, budgets }: VendorBillingProps) {
  const generatePDF = () => {
    console.log(">>> generatePDF started");

    if (!event) {
      console.warn("No event provided, aborting PDF generation");
      return;
    }

    if (!budgets || budgets.length === 0) {
      console.warn("No budgets provided, aborting PDF generation");
      return;
    }

    console.log("Vendor:", vendor);
    console.log("Event:", event);
    console.log("Budgets:", budgets);

    const doc = new jsPDF();

    console.log("jsPDF instance created");

    doc.setFontSize(18);
    doc.text("Planovae", 14, 20);
    doc.setFontSize(14);
    doc.text(`Billing Invoice for ${vendor.name}`, 14, 30);
    doc.setFontSize(11);
    doc.text(`Event: ${event.name}`, 14, 40);
    doc.text(`Start Date: ${event.startDate || "—"}`, 14, 46);
    doc.text(`End Date: ${event.endDate || "—"}`, 14, 52);

    console.log("Header added to PDF");

    // Prepare table data
    const tableData: any[] = [];

    budgets.forEach((b) => {
      console.log(`Processing budget: ${b.name}`);
      b.subcategories?.forEach((sub: any) => {
        console.log(`  Subcategory: ${sub.name}`);
        sub.vendors?.forEach((v: any) => {
          console.log(`    Vendor assignment: ${v.vendor}`);
          if (v.vendor === vendor._id) {
            const row = [
              b.name,                 // Category
              sub.name,               // Subcategory
              `$${sub.actualAmount}`, // Total
              `$${v.amount}`,         // Paid
              `$${sub.actualAmount - v.amount}`, // Due
            ];
            console.log("      Adding table row:", row);
            tableData.push(row);
          }
        });
      });
    });

    if (tableData.length === 0) {
      console.warn("No table rows found for this vendor in this event");
    }

    console.log("Table data prepared:", tableData);

    // Use `any` to fix TypeScript error for autoTable
    (doc as any).autoTable({
      startY: 60,
      head: [["Category", "Task", "Cost", "Paid", "Due"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [139, 92, 246] },
    });

    console.log("autoTable added to PDF");

    doc.save(`Invoice-${vendor.name}.pdf`);
    console.log("PDF download triggered");
  };

  return (
    <button
      onClick={generatePDF}
      className="border border-indigo-600 text-indigo-600 px-4 py-1.5 rounded-full text-xs hover:bg-indigo-50 transition"
    >
      Create Bill
    </button>
  );
}


