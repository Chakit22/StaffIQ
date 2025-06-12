import "dotenv/config";

import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Course } from "./entity/Course";
import { Application } from "./entity/Application";
import { Comment } from "./entity/Comment";
import Ranking from "./entity/Ranking";
import { Experience } from "./entity/Experience";
import { Role } from "./entity/Role";
import { Skill } from "./entity/Skill";
import { Availability } from "./entity/Availability";

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
    Comment,
    Experience,
    Ranking,
    Role,
    Skill,
    Availability,
  ],
  migrations: ["src/migration/*.ts"],
  migrationsRun: false,
  migrationsTableName: "typeorm_migrations",
  charset: "utf8mb4",
});
