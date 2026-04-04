import { z } from "zod";

export const UpdateApplicationStatusSchema = z.object({
  status: z.enum([
    "applied",
    "under_review",
    "shortlisted",
    "interview",
    "offered",
    "accepted",
    "rejected",
  ]),
});

export type UpdateApplicationStatusSchema = z.infer<typeof UpdateApplicationStatusSchema>;
