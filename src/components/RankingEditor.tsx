"use client";
import React from "react";

import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Applicant } from "@/types/ApplicantType";
import { toast } from "sonner";
import { useRanking } from "@/context/RankingProvider";
import { useAuth } from "@/context/UserProvider";
import { useRouter } from "next/navigation";
import CommentDialog from "./CommentDialog";

interface RankingEditorProps {
  course_code: string;
  role: string;
  selectedApplicants: Applicant[];
  applicants: number[];
  onCommentClick?: (applicantId: number) => void;
}

type ApplicantWithRanking = Applicant & {
  rank: number;
};

export function RankingEditor({
  course_code,
  role,
  selectedApplicants,
  applicants,
}: RankingEditorProps) {
  const [rankingData, setRankingData] = useState<ApplicantWithRanking[]>([]);
  const { saveRanking, rankings } = useRanking();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    //Updated rankingData and sorted by normal order
    setRankingData(
      selectedApplicants.map((selectedApplicant, index) => {
        return { ...selectedApplicant, rank: index + 1 };
      })
    );

    //Redirect if user is not logged in
    if (!user) {
      router.replace("/");
    }
  }, [selectedApplicants, user, router]);

  const handleRankMove = (id: number, direction: "up" | "down") => {
    const index = rankingData.findIndex((applicant) => applicant.id === id);
    if (index === -1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= rankingData.length) return;

    //Create a copy of rankingData and swap ranks
    const updatedRankings = [...rankingData];
    const temp = updatedRankings[index].rank;
    updatedRankings[index].rank = updatedRankings[newIndex].rank;
    updatedRankings[newIndex].rank = temp;

    //Sort by rank to ensure correct order
    updatedRankings.sort((a, b) => a.rank - b.rank);

    //Update local state
    setRankingData(updatedRankings);
  };

  const handleSaveRankingData = () => {
    //Save the updated ranking data
    saveRanking(
      course_code,
      role,
      user!.id,
      rankingData.map((app) => app.id)
    );
    toast.success("Preferences saved successfully!");
  };

  const handleSaveComment = (comment: string) => {
    //Save comment for the applicant
    console.log(applicants, rankings, comment);
    toast.success("Comment added successfully!");
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
                <Badge className="bg-blue-500">{`Rank: ${applicant.rank}`}</Badge>
                <CommentDialog handleSaveComment={handleSaveComment} />
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
