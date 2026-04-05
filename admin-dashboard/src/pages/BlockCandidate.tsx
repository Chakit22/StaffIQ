import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_LECTURERS } from "../graphQL/queries";
import { BLOCK_USER, UNBLOCK_USER } from "../graphQL/mutations";
import DashboardLayout from "../components/DashboardLayout";

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
      <div className="p-6">
        <div className="max-w-2xl mx-auto bg-card p-6 rounded-xl shadow-lg border border-border">
          <h2 className="text-xl font-bold mb-4 text-gray-200">Block / Unblock Lecturers</h2>

          {loading && <div className="text-center py-4 text-muted">Loading lecturers...</div>}
          {error && <div className="text-red-400 text-center py-4">Error: {error.message}</div>}

          <table className="w-full text-left">
            <thead className="bg-background">
              <tr>
                <th className="p-2 border-b border-border text-gray-400 text-sm">Name</th>
                <th className="p-2 border-b border-border text-gray-400 text-sm">Email</th>
                <th className="p-2 border-b border-border text-gray-400 text-sm">Status</th>
                <th className="p-2 border-b border-border text-gray-400 text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((user: User) => (
                <tr
                  key={user.id}
                  className={!user.access ? "opacity-50" : ""}
                >
                  <td className="p-2 border-b border-border text-gray-300">{user.name}</td>
                  <td className="p-2 border-b border-border text-gray-300">{user.email}</td>
                  <td className="p-2 border-b border-border">
                    <span className={`text-xs px-2 py-1 rounded ${user.access ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>
                      {user.access ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td className="p-2 border-b border-border">
                    <button
                      onClick={() => toggleBlock(user.id, !user.access)}
                      className={`px-4 py-1 rounded-lg text-white text-sm transition ${
                        !user.access
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {!user.access ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && candidates.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-muted p-4">
                    No lecturers available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BlockCandidate;
