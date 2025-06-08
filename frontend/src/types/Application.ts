import { Role } from "./Role";
import { User } from "./User";
import { Skill } from "./Skill";
import { Course } from "./Course";

export interface Application {
  id: string;
  academic_creds: string;
  availability: string;
  comments?: string;
  userId: string;
  courseId: string;
  roleId: string;
  user: User;
  course: Course;
  role: Role;
  skills: Skill[];
}

// DTO for creating an application
// export class CreateApplicationDto {
//   @IsNotEmpty() // Checks if given value is not empty (!== '', !== null, !== undefined).
//   @IsString()
//   academic_creds: string;

//   @IsNotEmpty()
//   @IsString()
//   availability: string;

//   @IsOptional()
//   @IsString()
//   comments: string;

//   @IsNotEmpty()
//   @IsString()
//   userId: string;

//   @IsNotEmpty()
//   @IsString()
//   courseId: string;

//   @IsNotEmpty()
//   @IsString()
//   roleId: string;

//   @IsNotEmpty()
//   @IsArray()
//   @ValidateNested({ each: true }) // Validate each object in the array
//   @Type(() => SkillInput)
//   skills: SkillInput[];
// }

// class SkillInput {
//   @IsNotEmpty()
//   @IsString()
//   id: string;

//   @IsNotEmpty()
//   @IsString()
//   name: string;
// }
