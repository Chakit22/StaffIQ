// This is the entity for the availability of a candidate

import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Availability {
  @PrimaryColumn("uuid")
  id: string;

  @Column()
  availability: string;
}
