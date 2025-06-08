// This is the entity for the availability of a candidate

import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { Application } from "./Application";

@Entity()
export class Availability {
  @PrimaryColumn("uuid")
  id: string;

  @Column()
  availability: string;

  // Many applicants can have the same availability
  @OneToMany(() => Application, (application) => application.availability)
  applications: Application[];
}
