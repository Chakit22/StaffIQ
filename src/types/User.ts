export interface User {
  firstname: string;
  lastname: string;
  phone: number;
  email: string;
  password: string;
  role: string;
}

export const DEFAULT_USERS: User[] = [
  {
    firstname: "chakit",
    lastname: "bhandari",
    phone: 434057320,
    email: "chakitbhandari22@gmail.com",
    password: "Chuck@123",
    role: "tutor",
  },
];
