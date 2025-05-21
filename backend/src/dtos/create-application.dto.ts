import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Skill } from "../entity/Skill";
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
  @IsArray()
  // @ValidateNested({ each: true }) // Validate each object in the array
  // @Type(() => Skill)
  skills: Skill[];
}
