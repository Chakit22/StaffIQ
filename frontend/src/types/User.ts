export interface User {
  id: number;
  name: string;
  email: string;
  role: "candidate" | "lecturer" | "admin";
  dateOfJoining: string;
  avatarUrl?: string;
}
