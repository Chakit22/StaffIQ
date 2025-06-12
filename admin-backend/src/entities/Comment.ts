import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn } from "typeorm";
import { Application } from "./Application";
import { User } from "./User";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity()
export class Comment {
  @Field(() => ID)
  @PrimaryColumn("uuid")
  lecturerId: string;

  @Field(() => ID)
  @PrimaryColumn("uuid")
  applicationId: string;

  @Field()
  @Column("text")
  comment: string;

  // Define relations
  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: "lecturerId" })
  lecturer: User;

  // if an application is deleted (because a course is deleted) then all the records in the Comment table for that application will be deleted.
  @Field(() => Application)
  @ManyToOne(() => Application, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "applicationId" })
  application: Application;
}
