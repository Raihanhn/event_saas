//components/dashboard/DashboardCard.tsx

import { FiCalendar, FiUsers, FiUser, FiShoppingCart } from "react-icons/fi";
import { useThemeContext } from "@/context/ThemeContext";

interface DashboardCardsProps {
  counts: {
    eventsCount: number;
    clientsCount: number;
    teamsCount: number;
    vendorsCount: number;
  };
}

// Tailwind-safe color map
const colorMap: Record<string, { bg: string; text: string }> = {
  indigo: { bg: "bg-indigo-100", text: "text-indigo-600" },
  green: { bg: "bg-green-100", text: "text-green-600" },
  amber: { bg: "bg-amber-100", text: "text-amber-600" },
  cyan: { bg: "bg-cyan-100", text: "text-cyan-600" },
};

export default function DashboardCards({ counts }: DashboardCardsProps) {
  const cards = [
    { title: "Total Events", value: counts.eventsCount, icon: <FiCalendar />, color: "indigo" },
    { title: "Total Clients", value: counts.clientsCount, icon: <FiUsers />, color: "green" },
    { title: "Total Teams", value: counts.teamsCount, icon: <FiUser />, color: "amber" },
    { title: "Total Vendors", value: counts.vendorsCount, icon: <FiShoppingCart />, color: "cyan" },
  ];
  const { theme } = useThemeContext();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {cards.map((card) => {
        const colors = colorMap[card.color];

        return (
          <div
            key={card.title}
            className={`
              shadow-lg rounded-2xl p-10 flex items-center transition-transform hover:scale-105
              ${theme === "dark"
                ? "bg-[#374151] border border-gray-700"
                : "bg-[#F3F4F6] border border-gray-200"}
            `}
          >
            <div className={`${colors.bg} ${colors.text} p-4 rounded-full text-xl`}>
              {card.icon}
            </div>

            <div className="ml-4">
              <p className="text-gray-500 font-medium">{card.title}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
