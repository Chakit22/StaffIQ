import { Application } from "@/types/Application";

function extractGpa(academicCreds: string | null | undefined): string {
  if (!academicCreds) return "";
  const match = academicCreds.match(/(\d+\.?\d*)/);
  return match ? match[1] : academicCreds;
}

function escapeCsvField(field: string): string {
  if (field.includes(",") || field.includes('"') || field.includes("\n")) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

export function exportConsensusCsv(
  applications: Application[],
  lecturerRankings: Map<string, Map<string, number>>,
  lecturerNames: Map<string, string>,
  consensusScores: Map<string, { score: number; label: string }>,
  courseName: string,
) {
  const lecturerIds = Array.from(lecturerNames.keys());

  const headers = [
    "Name",
    "Email",
    "Course",
    "Role",
    "GPA",
    "Skills",
    "Availability",
    ...lecturerIds.map((id) => `Rank - ${lecturerNames.get(id) || "Unknown"}`),
    "Consensus Score",
    "Consensus",
  ];

  const rows: string[][] = applications.map((app) => {
    const consensus = consensusScores.get(app.id);
    const row = [
      app.user.name,
      app.user.email,
      app.course?.name || courseName,
      app.role?.name || "",
      extractGpa(app.academic_creds),
      (app.skills || []).map((s) => s.name).join("; "),
      app.availability?.availability || "",
      ...lecturerIds.map((lecId) => {
        const rankMap = lecturerRankings.get(lecId);
        const rank = rankMap?.get(app.id);
        return rank !== undefined ? String(rank) : "-";
      }),
      consensus ? consensus.score.toFixed(2) : "-",
      consensus ? consensus.label : "-",
    ];
    return row;
  });

  const csvContent = [
    headers.map(escapeCsvField).join(","),
    ...rows.map((row) => row.map(escapeCsvField).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `${courseName.replace(/\s+/g, "_")}_consensus_${new Date().toISOString().split("T")[0]}.csv`,
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
