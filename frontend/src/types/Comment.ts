import { Application } from "./Application";
import { User } from "./User";

export interface Comment {
  lecturerId: string;
  applicationId: string;
  comment: string;
  lecturer: User;
  application: Application;
}

// export class UpdateAppCommentDto {
//     @IsNotEmpty()
//     @IsString()
//     lecturerId: string;

//     @IsNotEmpty()
//     @IsString()
//     applicationId: string;

//     @IsNotEmpty()
//     @IsString()
//     comment: string;
//   }
