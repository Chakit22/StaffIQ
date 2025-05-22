import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from "typeorm";
import { Application } from "./Application";
import { Experience } from "./Experience";
import { Course } from "./Course";
import Ranking from "./Ranking";

@Entity()
export class User {
  // auto-generated (this is known as auto-increment / sequence / serial / generated identity column). Primary Key Column
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: number;

  @Column()
  password: string;

  @Column()
  role: "candidate" | "lecturer" | "admin";

  // This is the date of joining this platform
  @CreateDateColumn()
  dateOfJoining: Date;

  // This is the access level of the user. True means the user has access to the platform. False means the user does not have access/blocked from the platform.
  @Column({ default: true })
  access?: boolean;

  @Column({ default: "defaultUrl" })
  avatarUrl?: string;

  // A user can have many applications
  @OneToMany(() => Application, (application) => application.user)
  applications: Application[];

  // A user can have many experiences
  @OneToMany(() => Experience, (experience) => experience.user)
  experiences: Experience[];

  // A lecturer can be assigned to many courses. Making it optional as a user can be of three types lecturer, admin or candidate
  // If a course is deleted all the lecturers assigned to it will be deleted as well in the LecturerCourse table
  // Owning side of the relation so JoinTable is added.
  @ManyToMany(() => Course, (course) => course.users, { onDelete: "CASCADE" })
  @JoinTable({ name: "LecturerCourse" })
  courses: Course[];
}
