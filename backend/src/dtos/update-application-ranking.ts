import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class UpdateApplicationRankingDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RankingInput)
  rankings: RankingInput[];
}

class RankingInput {
  @IsString()
  lecturerId: string;

  @IsString()
  applicationId: string;

  @IsNumber()
  rank: number;
}
