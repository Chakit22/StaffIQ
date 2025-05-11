import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Course } from './entities/Course';
import { Application } from './entities/Application';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Course, Application],
});
