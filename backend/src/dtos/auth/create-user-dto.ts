import {
  IsNotEmpty,
  isString,
  MinLength,
  Matches,
  IsString,
  IsEmail,
  IsNumber,
  IsStrongPassword,
  IsIn,
} from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  phone: number;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsIn(["candidate", "lecturer", "admin"])
  role: string;
}
