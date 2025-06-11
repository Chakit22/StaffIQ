import { z } from "zod";

export const UpdateApplicationCommentSchema = z.object({
  lecturerId: z.string().uuid(),
  applicationId: z.string().uuid(),
  comment: z.string(),
});

export type UpdateApplicationCommentSchema = z.infer<
  typeof UpdateApplicationCommentSchema
>;
