// planovae/modules/teams/ui/InviteSection.tsx

export default function InviteSection() {
  return (
    <div className="mt-8 bg-white border border-gray-300 rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-1">Invite new members</h2>
      <p className="text-sm text-gray-500 mb-4">
        Assign role to member via invite link.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <input
          placeholder="Enter email..."
          className="flex-1 border border-gray-300 focus:outline-none rounded-lg px-4 py-2"
        />
        <button className="bg-gray-900 text-white px-4 py-2 rounded-lg">
          Invite link
        </button>
      </div>
    </div>
  );
}
