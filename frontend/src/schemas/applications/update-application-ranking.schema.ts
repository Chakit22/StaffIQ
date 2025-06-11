import { z } from "zod";

const RankingInputSchema = z.object({
  lecturerId: z.string().uuid(),
  applicationId: z.string().uuid(),
  rank: z.number(),
});

export const UpdateApplicationRankingSchema = z.object({
  rankings: z.array(RankingInputSchema),
});

export type UpdateApplicationRankingSchema = z.infer<
  typeof UpdateApplicationRankingSchema
>;
