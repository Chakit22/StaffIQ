import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Application } from "./Application";
import { Experience } from "./Experience";
import { Course } from "./Course";

@ObjectType()
@Entity()
export class User {
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

  @Column()
  password: string;

  @Field()
  @Column()
  role: "candidate" | "lecturer";

  @Field()
  @CreateDateColumn()
  dateOfJoining: Date;

  @Field()
  @Column({ default: true })
  access: boolean;

  @Field()
  @Column({ default: "defaultUrl" })
  avatarUrl: string;

  @Field(() => [Application])
  @OneToMany(() => Application, (application) => application.user)
  applications: Application[];

  @Field(() => [Experience])
  @OneToMany(() => Experience, (experience) => experience.user)
  experiences: Experience[];

  @Field(() => [Course])
  @ManyToMany(() => Course, (course) => course.users, { onDelete: "CASCADE" })
  @JoinTable({ name: "LecturerCourse" })
  courses: Course[];
}
