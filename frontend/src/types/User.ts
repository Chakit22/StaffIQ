export interface User {
  name: string;
  email: string;
  phone: number;
  password: string;
  role: string;
}

// export class CreateUserDto {
//   @IsNotEmpty()
//   @IsString()
//   name: string;

//   @IsNotEmpty()
//   @IsEmail()
//   email: string;

//   @IsNotEmpty()
//   @IsNumber()
//   phone: number;

//   @IsNotEmpty()
//   @IsStrongPassword()
//   password: string;

//   @IsNotEmpty()
//   @IsIn(["candidate", "lecturer", "admin"])
//   role: string;
// }
