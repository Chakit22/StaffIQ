import { z } from "zod";

export const CreatePositionSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  courseId: z.string().uuid(),
  roleId: z.string().uuid(),
  requirements: z.string().optional(),
  positions_available: z.number().int().min(1),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
});

export type CreatePositionSchema = z.infer<typeof CreatePositionSchema>;
