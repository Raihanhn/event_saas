// pages/dashboard/index.tsx

import dynamic from "next/dynamic";
import { connectDB } from "@/lib/mongodb";
import { requireAuthServerSide } from "@/lib/auth";
import Event from "@/modules/events/event.model";
import Client from "@/modules/clients/client.model";
import User from "@/modules/users/user.model";
import Vendor from "@/modules/vendors/vendor.model";
import DashboardCards from "@/components/dashboard/DashboardCards";

const DashboardNotifications = dynamic(() => import("@/components/dashboard/DashboardNotifications"), { ssr: false });
const EventOverview = dynamic(() => import("@/components/dashboard/EventOverview"), { ssr: false });

interface Counts {
  eventsCount: number;
  clientsCount: number;
  teamsCount: number;
  vendorsCount: number;
}

interface DashboardProps {
  counts: Counts;
  role: "admin" | "team"; // add role to props
}

export default function Dashboard({ counts, role }: DashboardProps) {
  return (
    <div className=" h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div
        className={`grid grid-cols-1 gap-6 ${
          role === "admin" ? "lg:grid-cols-5" : "lg:grid-cols-4"
        }`}
      >
        {/* LEFT: Cards */}
        <div
          className={`${role === "admin" ? "lg:col-span-3" : "lg:col-span-4"}`}
        >
          <DashboardCards counts={counts} />
        </div>

        {/* RIGHT: Notifications only for admin */}
        {role === "admin" && (
          <div className="lg:col-span-2">
            <DashboardNotifications />
          </div>
        )}
      </div>

      {/* Event Overview Section */}
      <EventOverview role={role} />
      <div className="h-56"></div>
    </div>
  );
}

/* ---------------- SSR ---------------- */
export const getServerSideProps = requireAuthServerSide<DashboardProps>(
  async ({ user }) => {
    await connectDB();

    const [eventsCount, clientsCount, teamsCount, vendorsCount] =
      await Promise.all([
        Event.countDocuments({ organization: user.organization }),
        Client.countDocuments({ organization: user.organization }),
        User.countDocuments({ organization: user.organization }),
        Vendor.countDocuments({ organization: user.organization }),
      ]);

    return {
      props: {
        counts: { eventsCount, clientsCount, teamsCount, vendorsCount },
        role: user.role, // pass role to page
      },
    };
  },
);
