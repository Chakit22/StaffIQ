import { Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Entity } from "typeorm";
import { Application } from "./Application";

@Entity()
export class Role {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  // A role can have many applications
  @OneToMany(() => Application, (application) => application.role)
  applications: Application[];
}
