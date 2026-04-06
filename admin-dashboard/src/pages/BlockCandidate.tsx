import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_LECTURERS } from "../graphQL/queries";
import { BLOCK_USER, UNBLOCK_USER } from "../graphQL/mutations";
import DashboardLayout from "../components/DashboardLayout";
import { ShieldBan, ShieldCheck, Loader2 } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  access: boolean;
  role: string;
}

const BlockCandidate = () => {
  const { data, loading, error, refetch } = useQuery(GET_ALL_LECTURERS);
  const [blockUser] = useMutation(BLOCK_USER);
  const [unblockUser] = useMutation(UNBLOCK_USER);

  const toggleBlock = async (userId: string, isBlocked: boolean) => {
    try {
      if (isBlocked) {
        await unblockUser({ variables: { userId } });
      } else {
        await blockUser({ variables: { userId } });
      }
      refetch();
    } catch (err) {
      console.error("Error toggling user access:", err);
    }
  };

  const candidates = data?.getAllLecturers || [];

  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-pink-500 flex items-center justify-center">
              <ShieldBan size={18} className="text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Access Control
            </h2>
          </div>
          <p className="text-muted-text text-sm">
            Block or unblock lecturer access to the platform.
          </p>
        </div>

        <div className="glass-panel-elevated overflow-hidden">
          {loading && (
            <div className="flex items-center justify-center gap-2 py-12 text-muted-text">
              <Loader2 size={18} className="animate-spin" /> Loading users...
            </div>
          )}
          {error && (
            <div className="text-danger text-center py-8 text-sm">
              Error loading users: {error.message}
            </div>
          )}

          {!loading && !error && (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 text-left text-[11px] text-muted-text uppercase tracking-[0.15em] font-semibold">
                    Name
                  </th>
                  <th className="p-4 text-left text-[11px] text-muted-text uppercase tracking-[0.15em] font-semibold">
                    Email
                  </th>
                  <th className="p-4 text-left text-[11px] text-muted-text uppercase tracking-[0.15em] font-semibold">
                    Status
                  </th>
                  <th className="p-4 text-right text-[11px] text-muted-text uppercase tracking-[0.15em] font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((user: User) => (
                  <tr
                    key={user.id}
                    className={`table-row border-b border-border/50 last:border-0 ${
                      !user.access ? "opacity-60" : ""
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center">
                          <span className="text-[11px] font-bold text-primary">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <span className="text-[13px] font-medium text-gray-300">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-[13px] text-muted-text">
                      {user.email}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                          user.access
                            ? "bg-success/10 text-success border border-success/20"
                            : "bg-danger/10 text-danger border border-danger/20"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            user.access ? "bg-success" : "bg-danger"
                          }`}
                        />
                        {user.access ? "Active" : "Blocked"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => toggleBlock(user.id, !user.access)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200 ${
                          !user.access
                            ? "bg-success/10 text-success hover:bg-success/20 border border-success/10"
                            : "bg-danger/10 text-danger hover:bg-danger/20 border border-danger/10"
                        }`}
                      >
                        {!user.access ? (
                          <ShieldCheck size={13} />
                        ) : (
                          <ShieldBan size={13} />
                        )}
                        {!user.access ? "Unblock" : "Block"}
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && candidates.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center text-muted-text p-12 text-sm"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BlockCandidate;
