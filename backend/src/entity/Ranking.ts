import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn } from "typeorm";
import { User } from "./User";
import { Application } from "./Application";
import { Course } from "./Course";

@Entity()
export default class Ranking {
  // A lecturer will assign a rank to a application for a particular course
  // PK is a composite key of userId and applicationId
  @PrimaryColumn("uuid")
  userId: string;

  @PrimaryColumn("uuid")
  applicationId: string;

  @Column()
  rank: number;

  // Define relations

  // A lecturer can see all the rankings he has made for a particular course
  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;

  // if an application is deleted (because a course is deleted) then all the records in the Ranking table for that application will be deleted.
  @ManyToOne(() => Application, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "applicationId" })
  application: Application;
}
