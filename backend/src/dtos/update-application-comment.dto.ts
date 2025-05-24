import { IsNotEmpty, IsString } from "class-validator";

export class UpdateAppCommentDto {
  @IsNotEmpty()
  @IsString()
  lecturerId: string;

  @IsNotEmpty()
  @IsString()
  applicationId: string;

  @IsNotEmpty()
  @IsString()
  comment: string;
}
