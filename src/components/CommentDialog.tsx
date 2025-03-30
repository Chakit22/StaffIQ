"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";

export default function CommentDialog({
  handleSaveComment,
}: {
  handleSaveComment: (comment: string) => void;
}) {
  const [comment, setComment] = useState<string>("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add comment</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Add comment</DialogTitle>
        <DialogDescription>
          Add your comments about this candidate
        </DialogDescription>
        <div className="flex justify-center items-center p-4 h-full">
          <Textarea
            placeholder="Enter your comments here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <div className="flex justify-end items-center">
          <Button
            onClick={() => {
              setComment("");
              handleSaveComment(comment);
            }}
          >
            Save Comment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
