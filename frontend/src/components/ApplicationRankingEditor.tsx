"use client";

import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Application } from "@/types/Application";
import { toast } from "sonner";
import useApplication from "@/hooks/useApplication";
import CommentDialog from "./CommentDialog";

interface ApplicationRankingEditorProps {
  lecturerId: string;
  rankedApplications: Application[];
  onRankingsChanged: () => void;
}

type ApplicationWithRanking = Application & {
  rank: number;
};

export function ApplicationRankingEditor({
  lecturerId,
  rankedApplications,
  onRankingsChanged,
}: ApplicationRankingEditorProps) {
  const [rankingData, setRankingData] = useState<ApplicationWithRanking[]>([]);
  const { selectCandidate, updateComment } = useApplication();

  useEffect(() => {
    // Set up rankings based on the provided applications
    setRankingData(
      rankedApplications.map((app, index) => ({
        ...app,
        rank: index + 1,
      }))
    );
  }, [rankedApplications]);

  const handleRankMove = (id: string, direction: "up" | "down") => {
    const index = rankingData.findIndex((app) => app.id === id);
    if (index === -1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= rankingData.length) return;

    // Create a copy of rankingData and swap ranks
    const updatedRankings = [...rankingData];
    const temp = updatedRankings[index].rank;
    updatedRankings[index].rank = updatedRankings[newIndex].rank;
    updatedRankings[newIndex].rank = temp;

    // Sort by rank to ensure correct order
    updatedRankings.sort((a, b) => a.rank - b.rank);

    // Update local state
    setRankingData(updatedRankings);
  };

  const handleSaveRankingData = async () => {
    try {
      // Format rankings for the API
      const rankingsToUpdate = {
        rankings: rankingData.map((app) => ({
          lecturerId,
          applicationId: app.id,
          rank: app.rank,
        })),
      };

      // Save the updated ranking data
      const response = await selectCandidate(rankingsToUpdate);

      if (response.success) {
        toast.success("Rankings saved successfully!");
        onRankingsChanged();
      } else {
        toast.error(response.message || "Failed to save rankings");
      }
    } catch (error) {
      console.error("Error saving rankings:", error);
      toast.error("An error occurred while saving rankings");
    }
  };

  const handleSaveComment = async (comment: string, applicationId: string) => {
    try {
      // Save comment for the applicant
      const commentData = {
        lecturerId,
        applicationId,
        comment,
      };

      const response = await updateComment(commentData);

      if (response.success) {
        toast.success("Comment added successfully!");
      } else {
        toast.error(response.message || "Failed to save comment");
      }
    } catch (error) {
      console.error("Error saving comment:", error);
      toast.error("An error occurred while saving comment");
    }
  };

  if (rankingData.length === 0) {
    return (
      <div className="border rounded-xl shadow-sm">
        <div className="bg-blue-500 p-4 rounded-t-xl">
          <div className="text-2xl font-bold text-center text-primary-foreground">
            Selected Candidates
          </div>
        </div>
        <div className="flex justify-center items-center p-6 text-gray-500">
          No candidates selected yet. Select candidates from the list to rank
          them.
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-xl shadow-sm">
      <div className="bg-blue-500 p-4 rounded-t-xl">
        <div className="text-2xl font-bold text-center text-primary-foreground">
          Selected Candidates
        </div>
      </div>
      <div className="flex flex-col gap-4 p-4 justify-center items-center">
        {rankingData.map((application, index) => (
          <div
            key={application.id}
            className="flex sm:flex-row flex-col p-3 border border-blue-200 rounded-md bg-white gap-4 w-full"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="flex flex-col">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-blue-500"
                  onClick={() => handleRankMove(application.id, "up")}
                  disabled={index === 0}
                  aria-label="Move up"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-blue-500"
                  onClick={() => handleRankMove(application.id, "down")}
                  disabled={index === rankingData.length - 1}
                  aria-label="Move down"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1">
                <p className="font-medium text-blue-700">
                  {application.user.name}
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <p className="text-sm text-blue-600">
                    {application.course.name}
                  </p>
                  <p className="text-sm text-blue-600">
                    {application.role.name}
                  </p>
                  <p className="text-sm text-blue-600">
                    {application.availability.availability}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end items-center gap-3">
              <Badge className="bg-blue-500 p-2">{`Rank: ${application.rank}`}</Badge>
              <CommentDialog
                handleSaveComment={(comment) =>
                  handleSaveComment(comment, application.id)
                }
              />
            </div>
          </div>
        ))}
        <Button onClick={handleSaveRankingData} className="mt-2">
          Save Rankings
        </Button>
      </div>
    </div>
  );
}
