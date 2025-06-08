// @/types/User.ts

export type UserRole = "candidate" | "lecturer";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: number;
  password: string;
  role: UserRole;
  dateOfJoining: Date;
  access?: boolean;
  avatarUrl?: string;
}

export interface UserRegistrationInput {
  name: string;
  email: string;
  phone: number;
  password: string;
  role: UserRole;
}
