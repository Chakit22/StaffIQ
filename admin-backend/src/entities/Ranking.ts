import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn } from "typeorm";
import { User } from "./User";
import { Application } from "./Application";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity()
export class Ranking {
  // A lecturer will assign a rank to a application for a particular course
  // PK is a composite key of userId and applicationId
  @Field(() => ID)
  @PrimaryColumn("uuid")
  lecturerId: string;

  @Field(() => ID)
  @PrimaryColumn("uuid")
  applicationId: string;

  @Field()
  @Column()
  rank: number;

  // Define relations

  // A lecturer can see all the rankings he has made for a particular course
  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: "lecturerId" })
  lecturer: User;

  // if an application is deleted (because a course is deleted) then all the records in the Ranking table for that application will be deleted.
  @Field(() => Application)
  @ManyToOne(() => Application, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "applicationId" })
  application: Application;
}
