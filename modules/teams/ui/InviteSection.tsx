// planovae/modules/teams/ui/InviteSection.tsx
import { useThemeContext } from "@/context/ThemeContext";

export default function InviteSection() {
  const { theme } = useThemeContext();
  return (
    <div className={`mt-8 border rounded-xl p-6
        ${
          theme === "dark"
            ? "bg-[#1F2937] border-gray-700 text-white"
            : "bg-white border-gray-300 text-gray-900"
        }
      `}>
      <h2 className="text-lg font-semibold mb-1">Invite new members</h2>
      <p className={`text-sm mb-4
          ${theme === "dark" ? "text-gray-400" : "text-gray-500"}
        `}>
        Assign role to member via invite link.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <input
          placeholder="Enter email..."
          className={`flex-1 border focus:outline-none rounded-lg px-4 py-2
            ${
              theme === "dark"
                ? "bg-[#111827] border-gray-700 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900"
            }
          `}
        />
        <button className="bg-gray-900 text-white px-4 py-2 rounded-lg">
          Invite link
        </button>
      </div>
    </div>
  );
}
