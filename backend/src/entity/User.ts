import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Application } from "./Application";
import { Experience } from "./Experience";

@Entity()
export class User {
  // auto-generated (this is known as auto-increment / sequence / serial / generated identity column). Primary Key Column
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column({ nullable: true })
  dateOfJoining?: Date;

  @Column({ default: false })
  is_blocked?: boolean;

  @Column({ nullable: true })
  avatarUrl?: string;

  @OneToMany(() => Application, (application) => application.user)
  applications: Application[];

  @OneToMany(() => Experience, (experience) => experience.user)
  experiences: Experience[];
}
