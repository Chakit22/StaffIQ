import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

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

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  courseId: string;

  @IsNotEmpty()
  @IsString()
  roleId: string;

  @IsNotEmpty()
  @IsString()
  availabilityId: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true }) // Validate each object in the array
  @Type(() => SkillInput)
  skills: SkillInput[];
}

class SkillInput {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
