import { z } from "zod";

export const CreateApplicationDto = z.object({
  academic_creds: z.string(),
  userId: z.string(),
  courseId: z.string(),
  roleId: z.string(),
  availabilityId: z.string(),
  skills: z.array(z.string()),
});

export type CreateApplicationDto = z.infer<typeof CreateApplicationDto>;

// /**
//  * DTO for creating a application
//  */
// export class CreateApplicationDto {
//   @IsNotEmpty() // Checks if given value is not empty (!== '', !== null, !== undefined).
//   @IsString()
//   academic_creds: string;

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
//   @IsString()
//   availabilityId: string;

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
