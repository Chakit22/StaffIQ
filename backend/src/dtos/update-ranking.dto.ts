import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class UpdateRankingDto {
  @IsNotEmpty()
  @IsString()
  courseId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  applicationId: string;

  @IsNotEmpty()
  @IsNumber()
  rank: number;
}
