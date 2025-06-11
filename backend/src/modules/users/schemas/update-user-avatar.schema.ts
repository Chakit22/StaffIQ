import { z } from "zod";

export const UpdateUserAvatarSchema = z.object({
  avatarUrl: z.string(),
});

export type UpdateUserAvatarSchema = z.infer<typeof UpdateUserAvatarSchema>;
