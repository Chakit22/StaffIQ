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
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity()
export class User {
  // auto-generated (this is known as auto-increment / sequence / serial / generated identity column). Primary Key Column
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column()
  phone: string;

  @Field()
  @Column()
  password: string;

  @Field()
  @Column()
  role: "candidate" | "lecturer";

  // This is the date of joining this platform
  @Field()
  @CreateDateColumn()
  dateOfJoining: Date;

  // This is the access level of the user. True means the user has access to the platform. False means the user does not have access/blocked from the platform.
  @Field()
  @Column({ default: true })
  access?: boolean;

  @Field()
  @Column({ default: "defaultUrl" })
  avatarUrl?: string;

  // A user can have many applications
  @Field(() => [Application])
  @OneToMany(() => Application, (application) => application.user)
  applications: Application[];

  // A user can have many experiences
  @Field(() => [Experience])
  @OneToMany(() => Experience, (experience) => experience.user)
  experiences: Experience[];

  // A lecturer can be assigned to many courses. Making it optional as a user can be of three types lecturer, admin or candidate
  // If a course is deleted all the lecturers assigned to it will be deleted as well in the LecturerCourse table
  // Owning side of the relation so JoinTable is added.
  @Field(() => [Course])
  @ManyToMany(() => Course, (course) => course.users, { onDelete: "CASCADE" })
  @JoinTable({ name: "LecturerCourse" })
  courses: Course[];
}
