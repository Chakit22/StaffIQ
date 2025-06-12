import React, { useEffect, useState } from "react";

// Candidate interface
interface Candidate {
  id: string;
  name: string;
  email: string;
  isBlocked: boolean;
}

const BlockCandidate = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  // This should later be replaced by useQuery(GET_CANDIDATES)
  useEffect(() => {
    setCandidates([
      { id: "u1", name: "Alice Zhang", email: "alice@example.com", isBlocked: false },
      { id: "u2", name: "Brian Lee", email: "brian@example.com", isBlocked: true },
    ]);
  }, []);

  // Later replace with a mutation (BLOCK_CANDIDATE / UNBLOCK_CANDIDATE)
  const toggleBlock = (id: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isBlocked: !c.isBlocked } : c))
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Block / Unblock Candidates</h2>

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
            {candidates.map((c) => (
              <tr
                key={c.id}
                className={c.isBlocked ? "bg-red-50 text-gray-400 line-through" : ""}
              >
                <td className="p-2 border">{c.name}</td>
                <td className="p-2 border">{c.email}</td>
                <td className="p-2 border">{c.isBlocked ? "Blocked" : "Active"}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => toggleBlock(c.id)}
                    className={`px-4 py-1 rounded text-white ${
                      c.isBlocked
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {c.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
            {candidates.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 p-4">
                  No candidates available.
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
