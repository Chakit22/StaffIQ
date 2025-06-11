import { Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Skill {
  @PrimaryColumn()
  name: string;
}
