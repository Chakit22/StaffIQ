import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_LECTURERS } from "../graphQL/queries";
import { BLOCK_USER, UNBLOCK_USER } from "../graphQL/mutations";

// User interface to match the GraphQL response
interface User {
  id: string;
  name: string;
  email: string;
  access: boolean;
  role: string;
}

const BlockCandidate = () => {
  // Query to get all lecturers
  const { data, loading, error, refetch } = useQuery(GET_ALL_LECTURERS);

  // Mutations for blocking and unblocking users
  const [blockUser] = useMutation(BLOCK_USER);
  const [unblockUser] = useMutation(UNBLOCK_USER);

  // Toggle the block status of a user
  const toggleBlock = async (userId: string, isBlocked: boolean) => {
    try {
      if (isBlocked) {
        // If currently blocked, unblock the user
        await unblockUser({
          variables: { userId },
        });
      } else {
        // If currently active, block the user
        await blockUser({
          variables: { userId },
        });
      }
      // Refresh the lecturers list
      refetch();
    } catch (err) {
      console.error("Error toggling user access:", err);
      alert("Failed to update user access. Please try again.");
    }
  };

  // Get the lecturers from the query response
  const candidates = data?.getAllLecturers || [];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Block / Unblock Lecturers</h2>

        {loading && (
          <div className="text-center py-4">Loading lecturers...</div>
        )}
        {error && (
          <div className="text-red-500 text-center py-4">
            Error loading lecturers: {error.message}
          </div>
        )}

        <table className="w-full border text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((user: User) => (
              <tr
                key={user.id}
                className={
                  !user.access ? "bg-red-50 text-gray-400 line-through" : ""
                }
              >
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">
                  {user.access ? "Active" : "Blocked"}
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => toggleBlock(user.id, !user.access)}
                    className={`px-4 py-1 rounded text-white ${
                      !user.access
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {!user.access ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
            {!loading && candidates.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 p-4">
                  No lecturers available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlockCandidate;
