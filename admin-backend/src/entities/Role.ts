import { Column, OneToMany, PrimaryGeneratedColumn, Entity } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Application } from "./Application";

@ObjectType()
@Entity()
export class Role {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  name: string;

  @Field(() => [Application])
  @OneToMany(() => Application, (application) => application.role)
  applications: Application[];
}
