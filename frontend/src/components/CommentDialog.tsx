"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";

interface CommentDialogProps {
  handleSaveComment: (comment: string) => void;
  initialComment?: string;
}

export default function CommentDialog({
  handleSaveComment,
  initialComment = "",
}: CommentDialogProps) {
  const [comment, setComment] = useState(initialComment);
  const [open, setOpen] = useState(false);

  const onSave = () => {
    handleSaveComment(comment);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageSquare className="h-4 w-4 mr-2" />
          Comment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Comment</DialogTitle>
          <DialogDescription>
            Add your comments about this candidate
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comment here..."
            className="min-h-[100px]"
          />
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save Comment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
