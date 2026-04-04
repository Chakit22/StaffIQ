import { Course } from "./Course";
import { Role } from "./Role";
import { User } from "./User";

export interface Position {
  id: string;
  title: string;
  description: string;
  courseId: string;
  roleId: string;
  requirements: string | null;
  positions_available: number;
  deadline: string;
  status: "open" | "closed" | "filled";
  created_by: string;
  created_at: string;
  course: Course;
  role: Role;
  creator: User;
}
