import { Entity, PrimaryColumn } from "typeorm";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
@Entity()
export class Skill {
  @Field()
  @PrimaryColumn()
  name: string;
}
