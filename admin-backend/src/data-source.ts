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
import { Ranking } from "./entities/Ranking";
import { Comment } from "./entities/Comment";
import { Position } from "./entities/Position";

const dbUrl = process.env.DATABASE_URL;

export const AppDataSource = new DataSource({
  type: "mysql",
  ...(dbUrl
    ? {
        url: dbUrl.replace(/\?ssl-mode=REQUIRED/, ""),
        ssl: { rejectUnauthorized: false },
      }
    : {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
      }),
  synchronize: dbUrl ? true : false,
  logging: !dbUrl,
  entities: [
    User,
    Course,
    Application,
    Experience,
    Role,
    Skill,
    Availability,
    Admin,
    Comment,
    Ranking,
    Position,
  ],
  migrations: dbUrl ? [] : ["src/migrations/*.ts"],
  migrationsTableName: "migrations",
});
