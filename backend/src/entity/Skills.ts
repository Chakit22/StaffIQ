import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Application } from "./Application";
import { application } from "express";

@Entity()
export class Skills {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;
}
