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
import { Avatar } from "./entity/Avatar";
import { Position } from "./entity/Position";

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
    Comment,
    Experience,
    Ranking,
    Role,
    Skill,
    Availability,
    Avatar,
    Position,
  ],
  migrations: dbUrl ? [] : ["src/migration/*.ts"],
  migrationsRun: false,
  migrationsTableName: "typeorm_migrations",
  charset: "utf8mb4",
});
