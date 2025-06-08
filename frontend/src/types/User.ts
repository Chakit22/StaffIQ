// @/types/User.ts
import { Application } from "./Application";
import { Experience } from "./Experience";

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
  applications: Application[];
  experiences: Experience[];
}

export interface UserRegistrationInput {
  name: string;
  email: string;
  phone: number;
  password: string;
  role: UserRole;
}
