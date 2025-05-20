import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

/**
 * DTO for creating a application
 */
export class CreateApplicationDto {
  @IsNotEmpty() // Checks if given value is not empty (!== '', !== null, !== undefined).
  @IsString()
  academic_creds: string;

  @IsNotEmpty()
  @IsString()
  availability: string;

  @IsOptional()
  @IsString()
  comments: string;

  @IsOptional()
  @IsBoolean()
  is_chosen: boolean;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  courseId: number;

  @IsNotEmpty()
  @IsNumber()
  roleId: number;

  @IsNotEmpty()
  @IsArray()
  skills: string[];
}
