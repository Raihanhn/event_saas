// pages/teams.tsx
import { useState, useMemo } from "react";
import useSWR from "swr";
import Image from "next/image";

import CreateTeamModal from "@/modules/teams/ui/CreateTeamModal";
import EditTeamModal from "@/modules/teams/ui/EditTeamModal";
import Pagination from "@/modules/common/Pagination";

import { connectDB } from "@/lib/mongodb";
import { requireAuthServerSide } from "@/lib/auth";
import UserModel from "@/modules/users/user.model";
import { getAvatarFromId } from "@/lib/avatarFromId";
import InviteSection from "@/modules/teams/ui/InviteSection";
import TeamSearch from "@/modules/teams/ui/TeamSearch";

type TeamMember = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "team" | "client";
  location?: string;
  permissions?: {
    canEditVendor: boolean;
  };
};

type Props = {
  initialMembers: TeamMember[];
  currentUser: {
    id: string;
    role: "admin" | "team" | "client";
    organization: string;
  };
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Teams({ initialMembers, currentUser }: Props) {
  const { data: members = [], mutate } = useSWR<TeamMember[]>(
    "/api/teams",
    fetcher,
    { fallbackData: initialMembers },
  );
  const [search, setSearch] = useState("");
   
  const filteredMembers = useMemo(() => {
  return members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );
}, [members, search]);


  /* ---------------- Pagination ---------------- */
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const paginatedMembers = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filteredMembers.slice(start, start + PER_PAGE);
  }, [filteredMembers, page]);

  /* ---------------- Modals ---------------- */
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editMember, setEditMember] = useState<TeamMember | null>(null);

  return (
    <div className="p-6 space-y-6 h-screen">
      <div className="p-6 bg-[#F9FAFB] min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#111827]">Team members</h1>

        {currentUser.role === "admin" && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-4 py-2 rounded-lg transition transform hover:scale-105 cursor-pointer"
          >
            + Create member
          </button>
        )}
      </div>

      {/* Search */}
<TeamSearch search={search} setSearch={setSearch} setPage={setPage} />

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-x-auto">
        <table className="w-full table-fixed text-sm min-w-[700px]">
          <thead className="bg-[#F3F4F6] text-[#6B7280]">
            <tr>
              <th className="px-4 py-3 text-left">Member</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Current Projects</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Permissions</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedMembers.map((member) => {
              const isSelfAdmin =
                member.role === "admin" && currentUser.id === member._id;

              // Dummy projects for now
              const projects = ["#FCA5A5", "#93C5FD", "#FCD34D"];

              return (
                <tr key={member._id} className="hover:bg-gray-50">
                  {/* Member */}
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-3">
                      <Image
                        src={getAvatarFromId(member._id)}
                        alt={member.name}
                        width={36}
                        height={36}
                        className="rounded-full flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-medium text-[#111827] truncate">
                          {member.name}
                        </div>
                        <div className="text-xs text-[#6B7280] truncate">
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-4 py-3 align-middle capitalize">
                    {member.role}
                  </td>

                  {/* Current Projects */}
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center -space-x-2">
                      {projects.map((color, i) => (
                        <span
                          key={i}
                          className="w-5 h-5 rounded-full border-2 border-white"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </td>

                  {/* Location */}
                  <td className="px-4 py-3 align-middle text-gray-600">
                    {member.location || "—"}
                  </td>

                  {/* Permissions */}
                  <td className="px-4 py-3 align-middle text-gray-600 text-xs">
                    {member.permissions?.canEditVendor ? "Yes" : "No"}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 align-middle text-right">
                    {currentUser.role === "admin" && (
                      <button
                        disabled={isSelfAdmin}
                        onClick={() => setEditMember(member)}
                        className={`px-3 py-1 rounded-lg text-sm transition transform hover:scale-105 cursor-pointer ${
                          isSelfAdmin
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                      >
                        Manage
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <Pagination
          page={page}
          total={members.length}
          perPage={PER_PAGE}
          onPageChange={setPage}
        />
      </div>

        {/* Push InviteSection to bottom */}
  <div className="mt-auto">
    <InviteSection />
  </div>


      {/* Create */}
      {showCreateModal && (
        <CreateTeamModal
          onClose={() => {
            setShowCreateModal(false);
            mutate();
          }}
        />
      )}

      {/* Manage / Edit */}
      {editMember && (
        <EditTeamModal
          member={editMember}
          onClose={() => {
            setEditMember(null);
            mutate();
          }}
        />
      )}
    </div>
       <div className="h-56"></div>
    </div>
    
  );
}

/* ---------------- SSR ---------------- */
export const getServerSideProps = requireAuthServerSide<Props>(
  async (context) => {
    await connectDB();

    const members = await UserModel.find({
      organization: context.user.organization,
    })
      .select("_id name email role location permissions")
      .lean();

    return {
      props: {
        initialMembers: JSON.parse(JSON.stringify(members)),
        currentUser: JSON.parse(JSON.stringify(context.user)),
      },
    };
  },
);
