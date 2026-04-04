import { Role } from "./Role";
import { User } from "./User";
import { Skill } from "./Skill";
import { Course } from "./Course";
import { Availability } from "./Availability";

export interface Application {
  id: string;
  academic_creds: string;
  cover_letter?: string | null;
  resume_path?: string | null;
  userId: string;
  courseId: string;
  roleId: string;
  availabilityId: string;
  user: User;
  course: Course;
  role: Role;
  availability: Availability;
  skills: Skill[];
}

export interface Applicant {
  id: number;
  firstname?: string;
  lastname?: string;
  email?: string;
  role: string;
  availability: string;
  skills: string;
}

export interface MyApplication extends Application {
  rankings: { rank: number; lecturerName: string }[];
  rankingCount: number;
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
