import "dotenv/config";

import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Course } from "./entities/Course";
import { Application } from "./entities/Application";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [User, Course, Application],
});
