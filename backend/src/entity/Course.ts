import { Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Entity } from "typeorm";
import { Application } from "./Application";

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  course_code: string;

  @OneToMany(() => Application, (application) => application.course)
  applications: Application[];
}
