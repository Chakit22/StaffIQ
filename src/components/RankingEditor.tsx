"use client";

import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Applicant } from "@/types/ApplicantType";
import { toast } from "sonner";
import { useRanking } from "@/context/RankingProvider";
import { useAuth } from "@/context/UserProvider";
import { useRouter } from "next/navigation";

interface RankingEditorProps {
  course_code: string;
  role: string;
  selectedApplicants: Applicant[];
  onCommentClick?: (applicantId: number) => void;
}

type ApplicantWithRanking = Applicant & {
  rank: number;
};

export function RankingEditor({
  course_code,
  role,
  selectedApplicants,
}: RankingEditorProps) {
  const [rankingData, setRankingData] = useState<ApplicantWithRanking[]>([]);
  const { saveRanking, rankings, getMostLeastAndUnchosen } = useRanking();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Updated the rankingData and sorted by the normal order
    setRankingData(
      selectedApplicants.map((selectedApplicant, index) => {
        return { ...selectedApplicant, rank: index + 1 };
      })
    );

    console.log(user);
    if (!user) {
      router.replace("/");
    }
  }, [selectedApplicants]);

  const handleRankMove = (id: number, direction: "up" | "down") => {
    const index = rankingData.findIndex((applicant) => applicant.id === id);
    if (index === -1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= rankingData.length) return;

    // Create a copy of the ranking data
    const updatedRankings = [...rankingData];

    // Swap the ranks of the two applicants
    const temp = updatedRankings[index].rank;
    updatedRankings[index].rank = updatedRankings[newIndex].rank;
    updatedRankings[newIndex].rank = temp;

    // Sort by rank to ensure correct order
    updatedRankings.sort((a, b) => a.rank - b.rank);

    // Update local state
    setRankingData(updatedRankings);
  };

  const handleSaveRankingData = () => {
    // This updated the ranking data. So we need to have a hook or something to update the ranking
    saveRanking(
      course_code,
      role,
      user?.id!,
      rankingData.map((app) => app.id)
    );
    toast.success("Preferences saved successfully!");
  };

  return (
    <div className="w-full flex flex-col items-center border rounded-xl shadow-sm">
      <div className="w-full bg-blue-500 p-4 rounded-t-xl">
        <div className="text-2xl font-bold text-primary-foreground">
          {role.toUpperCase()}
        </div>
      </div>
      {rankingData.length > 0 && (
        <div className="flex flex-col gap-4 p-4 justify-center items-center">
          {rankingData.map((applicant, index) => (
            <div
              key={applicant.id}
              className="flex items-center justify-between p-3 border border-blue-200 rounded-md bg-white"
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-blue-500"
                    onClick={() => handleRankMove(applicant.id, "up")}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                    <span className="sr-only">Move up</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-blue-500"
                    onClick={() => handleRankMove(applicant.id, "down")}
                    disabled={index === rankingData.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                    <span className="sr-only">Move down</span>
                  </Button>
                </div>
                <div>
                  <p className="font-medium text-blue-700">
                    {applicant.firstname}
                  </p>
                  <p className="text-sm text-blue-600">
                    {applicant.availability}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-600">{`Rank: ${applicant.rank}`}</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Add the code for updating the comments
                    // onCommentClick(applicant.id);
                  }}
                  className="border-blue-300 hover:bg-blue-100 text-blue-700"
                >
                  Add comment
                </Button>
              </div>
            </div>
          ))}
          <Button onClick={handleSaveRankingData}>Save Preferences</Button>
        </div>
      )}
      {rankingData.length === 0 && (
        <div className="flex justify-center items-center h-full">
          No Candidates Selected
        </div>
      )}
    </div>
  );
}
