import { IsNotEmpty, IsString } from "class-validator";

export class UpdateAppStatusDto {
  @IsNotEmpty()
  @IsString()
  applicationId: string;

  @IsNotEmpty()
  @IsString()
  lecturerId: string;
}
