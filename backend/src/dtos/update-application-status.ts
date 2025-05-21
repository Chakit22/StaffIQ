import { IsNotEmpty, IsBoolean } from "class-validator";

export class UpdateAppStatusDto {
  @IsNotEmpty()
  @IsBoolean()
  is_chosen: boolean;
}
