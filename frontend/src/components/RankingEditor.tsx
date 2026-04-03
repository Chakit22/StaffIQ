"use client";

import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
interface Applicant {
  id: number;
  firstname?: string;
  lastname?: string;
  role: string;
  availability?: string;
}
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
}: RankingEditorProps) {
  const [rankingData, setRankingData] = useState<ApplicantWithRanking[]>([]);
  const { saveRanking } = useRanking();
  const { user, userLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setRankingData(
      selectedApplicants.map((selectedApplicant, index) => {
        return { ...selectedApplicant, rank: index + 1 };
      }),
    );

    if (!user && !userLoading) {
      router.replace("/");
    }
  }, [selectedApplicants, user, userLoading, router]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    if (sourceIndex === destIndex) return;

    const items = Array.from(rankingData);
    const [reorderedItem] = items.splice(sourceIndex, 1);
    items.splice(destIndex, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

    setRankingData(updatedItems);
  };

  const handleSaveRankingData = () => {
    saveRanking(
      course_code,
      role,
      user!.id,
      rankingData.map((app) => app.id),
    );
    toast.success("Preferences saved successfully!");
  };

  const handleSaveComment = (comment: string) => {
    console.log("comment", comment);
    toast.success("Comment added successfully!");
  };

  return (
    <div className="border rounded-xl shadow-sm">
      <div className="bg-primary p-4 rounded-t-xl">
        <div className="text-2xl font-bold text-center text-primary-foreground">
          {role.toUpperCase()}
        </div>
      </div>
      {rankingData.length > 0 && (
        <div className="flex flex-col gap-4 p-4 justify-center items-center">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId={`ranking-${course_code}-${role}`}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex flex-col gap-3 w-full transition-colors duration-200 ${
                    snapshot.isDraggingOver ? "bg-secondary/50 rounded-lg p-2" : ""
                  }`}
                >
                  {rankingData.map((applicant, index) => (
                    <Draggable
                      key={applicant.id}
                      draggableId={String(applicant.id)}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex sm:flex-row flex-col p-3 border rounded-md gap-4 transition-shadow duration-200 ${
                            snapshot.isDragging
                              ? "shadow-lg border-accent bg-secondary"
                              : "border-border bg-card"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-primary transition-colors"
                            >
                              <GripVertical className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {applicant.firstname}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {applicant.availability}
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-center items-center gap-3">
                            <Badge className="bg-primary p-2">{`Rank: ${applicant.rank}`}</Badge>
                            <CommentDialog
                              handleSaveComment={handleSaveComment}
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
          <Button onClick={handleSaveRankingData}>Save Preferences</Button>
        </div>
      )}
      {rankingData.length === 0 && (
        <div className="flex justify-center items-center p-4 text-muted-foreground">
          No Candidates Selected
        </div>
      )}
    </div>
  );
}
