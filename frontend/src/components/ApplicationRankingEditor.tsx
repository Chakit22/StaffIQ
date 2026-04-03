"use client";

import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { GripVertical, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Application } from "@/types/Application";
import { toast } from "sonner";
import useApplication from "@/hooks/useApplication";
import useAI from "@/hooks/useAI";
import CommentDialog from "./CommentDialog";

interface ApplicationRankingEditorProps {
  lecturerId: string;
  rankedApplications: Application[];
  onRankingsChanged: () => void;
}

type ApplicationWithRanking = Application & {
  rank: number;
  aiReason?: string;
};

export function ApplicationRankingEditor({
  lecturerId,
  rankedApplications,
  onRankingsChanged,
}: ApplicationRankingEditorProps) {
  const [rankingData, setRankingData] = useState<ApplicationWithRanking[]>([]);
  const [isAISuggesting, setIsAISuggesting] = useState(false);
  const { selectCandidate, updateComment } = useApplication();
  const { getRankingSuggestion } = useAI();

  useEffect(() => {
    setRankingData(
      rankedApplications.map((app, index) => ({
        ...app,
        rank: index + 1,
      })),
    );
  }, [rankedApplications]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    if (sourceIndex === destIndex) return;

    const items = Array.from(rankingData);
    const [reorderedItem] = items.splice(sourceIndex, 1);
    items.splice(destIndex, 0, reorderedItem);

    // Update rank numbers
    const updatedItems = items.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

    setRankingData(updatedItems);
  };

  const handleAISuggestRankings = async () => {
    if (rankingData.length < 2) {
      toast.error("Need at least 2 candidates for AI ranking suggestions");
      return;
    }

    setIsAISuggesting(true);
    try {
      const courseId = rankingData[0].courseId;
      const applicationIds = rankingData.map((app) => app.id);

      const response = await getRankingSuggestion(courseId, applicationIds);

      if (response.success && response.body?.suggestions) {
        const suggestions = response.body.suggestions;

        // Create a map of suggestions by applicationId
        const suggestionMap = new Map(
          suggestions.map((s: any) => [s.applicationId, s]),
        );

        // Reorder based on AI suggestions
        const reordered = [...rankingData]
          .sort((a, b) => {
            const rankA =
              (suggestionMap.get(a.id) as any)?.suggestedRank ?? Infinity;
            const rankB =
              (suggestionMap.get(b.id) as any)?.suggestedRank ?? Infinity;
            return rankA - rankB;
          })
          .map((item, index) => ({
            ...item,
            rank: index + 1,
            aiReason:
              (suggestionMap.get(item.id) as any)?.reason || undefined,
          }));

        setRankingData(reordered);
        toast.success("AI ranking suggestions applied! Drag to adjust.");
      } else {
        toast.error(response.message || "Failed to get AI suggestions");
      }
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      toast.error("An error occurred while getting AI suggestions");
    } finally {
      setIsAISuggesting(false);
    }
  };

  const handleSaveRankingData = async () => {
    try {
      const rankingsToUpdate = {
        rankings: rankingData.map((app) => ({
          lecturerId,
          applicationId: app.id,
          rank: app.rank,
        })),
      };

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
      <div className="bg-blue-500 p-4 rounded-t-xl flex items-center justify-between">
        <div className="text-2xl font-bold text-primary-foreground flex-1 text-center">
          Selected Candidates
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleAISuggestRankings}
          disabled={isAISuggesting}
          className="flex items-center gap-2"
        >
          {isAISuggesting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {isAISuggesting ? "Suggesting..." : "AI Suggest Rankings"}
        </Button>
      </div>
      <div className="flex flex-col gap-4 p-4 justify-center items-center">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="ranking-list">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex flex-col gap-3 w-full transition-colors duration-200 ${
                  snapshot.isDraggingOver ? "bg-blue-50 rounded-lg p-2" : ""
                }`}
              >
                {rankingData.map((application, index) => (
                  <Draggable
                    key={application.id}
                    draggableId={application.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex sm:flex-row flex-col p-3 border rounded-md gap-4 w-full transition-shadow duration-200 ${
                          snapshot.isDragging
                            ? "shadow-lg border-blue-400 bg-blue-50"
                            : "border-blue-200 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-blue-500 transition-colors"
                          >
                            <GripVertical className="h-5 w-5" />
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
                            {application.aiReason && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <p className="text-xs text-purple-600 mt-1 flex items-center gap-1 cursor-help">
                                      <Sparkles className="h-3 w-3" />
                                      AI: {application.aiReason}
                                    </p>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{application.aiReason}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
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
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <Button onClick={handleSaveRankingData} className="mt-2">
          Save Rankings
        </Button>
      </div>
    </div>
  );
}
