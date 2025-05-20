import { Column, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Entity } from "typeorm";
import { Application } from "./Application";
import { User } from "./User";

@Entity()
export class Course {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  course_code: string;

  // A course can have many applications
  @OneToMany(() => Application, (application) => application.course)
  applications: Application[];

  // A course can have many lecturers assigned to it
  @ManyToMany(() => User, (user) => user.courses)
  users: User[];
}
