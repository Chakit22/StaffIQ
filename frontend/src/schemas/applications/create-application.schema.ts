import { z } from "zod";

const SkillSchema = z.object({
  name: z.string(),
});

export const CreateApplicationSchema = z.object({
  academic_creds: z.string(),
  cover_letter: z.string().optional(),
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
  roleId: z.string().uuid(),
  availabilityId: z.string().uuid(),
  skills: z.array(SkillSchema),
});

export type CreateApplicationSchema = z.infer<typeof CreateApplicationSchema>;
