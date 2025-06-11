// @/types/User.ts
import { Application } from "./Application";
import { Experience } from "./Experience";
import { Course } from "./Course";

export type UserRole = "candidate" | "lecturer";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  dateOfJoining: Date;
  access?: boolean;
  avatarUrl?: string;
  applications: Application[];
  experiences: Experience[];
  courses: Course[];
}

export interface UserRegistrationInput {
  name: string;
  email: string;
  phone: number;
  password: string;
  role: UserRole;
}
