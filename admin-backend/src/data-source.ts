import "dotenv/config";

import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Course } from "./entities/Course";
import { Application } from "./entities/Application";
import { Experience } from "./entities/Experience";
import { Role } from "./entities/Role";
import { Skill } from "./entities/Skill";
import { Availability } from "./entities/Availability";
import { Admin } from "./entities/Admin";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  // Indicates if database schema should be auto created on every application launch. Should be false in production.
  synchronize: false,
  logging: true,
  entities: [
    User,
    Course,
    Application,
    Experience,
    Role,
    Skill,
    Availability,
    Admin,
  ],
});
