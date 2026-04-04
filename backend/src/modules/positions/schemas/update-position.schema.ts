import { z } from "zod";

export const UpdatePositionSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  requirements: z.string().optional(),
  positions_available: z.number().int().min(1).optional(),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }).optional(),
  status: z.enum(["open", "closed", "filled"]).optional(),
});

export type UpdatePositionSchema = z.infer<typeof UpdatePositionSchema>;
