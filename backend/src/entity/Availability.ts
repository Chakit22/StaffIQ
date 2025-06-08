import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Application } from "./Application";

@Entity()
export class Availability {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  availability: string;
}
