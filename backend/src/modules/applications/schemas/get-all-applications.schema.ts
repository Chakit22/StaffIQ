import { z } from "zod";

const SkillSchema = z.object({
  name: z.string(),
});

export const GetAllApplicationsSchema = z.object({
  courses: z.array(z.string().uuid()).optional(),
  roles: z.array(z.string().uuid()).optional(),
  availabilities: z.array(z.string().uuid()).optional(),
  skills: z.array(SkillSchema).optional(),
  search: z.string().optional(),
  sortBy: z
    .enum([
      "course_name_asc",
      "course_name_desc",
      "availability_asc",
      "availability_desc",
    ])
    .optional(),
});

export type GetAllApplicationsSchema = z.infer<typeof GetAllApplicationsSchema>;
