import { Application } from "./Application";
import { User } from "./User";

export interface Ranking {
  rankings: RankingInput[];
}

interface RankingInput {
  lecturerId: string;
  applicationId: string;
  rank: number;
  lecturer: User;
  application: Application;
}

// export class UpdateApplicationRankingDto {
//   @IsNotEmpty()
//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => RankingInput)
//   rankings: RankingInput[];
// }

// class RankingInput {
//   @IsString()
//   lecturerId: string;

//   @IsString()
//   applicationId: string;

//   @IsNumber()
//   rank: number;
// }
