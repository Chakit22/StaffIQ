import {
  Column,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Entity,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Application } from "./Application";
import { User } from "./User";

@ObjectType()
@Entity()
export class Course {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  course_code: string;

  @Field(() => [Application])
  @OneToMany(() => Application, (application) => application.course)
  applications: Application[];

  @Field(() => [User])
  @ManyToMany(() => User, (user) => user.courses)
  users: User[];
}
