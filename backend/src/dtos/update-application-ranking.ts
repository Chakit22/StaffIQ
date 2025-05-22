import { IsArray, IsNotEmpty, ValidateNested } from "class-validator";
import Ranking from "../entity/Ranking";
import { Type } from "class-transformer";

export class UpdateApplicationRankingDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Ranking)
  rankings: Ranking[];
}
