import { IsOptional, IsString } from "class-validator";

export class GetAllApplicationsDto {
  @IsOptional()
  @IsString()
  courses: string;

  @IsOptional()
  @IsString()
  roles: string;

  @IsOptional()
  @IsString()
  availabilities: string;

  @IsOptional()
  @IsString()
  skills: string;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsString()
  sortBy: string;
}
