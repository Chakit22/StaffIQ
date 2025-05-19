import { Entity, Column, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./User";
import { Application } from "./Application";
import { Course } from "./Course";

@Entity()
export default class Ranking {
  // A lecturer will assign a rank to a application for a particular course
  // PK is a composite key of courseId, userId and applicationId
  @PrimaryColumn()
  courseId: number;

  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  applicationId: number;

  @Column()
  rank: number;

  // Define relations
  // If a course is deleted all the rankings for that course will be deleted
  @ManyToOne(() => Course, { onDelete: "CASCADE" })
  course: Course;

  // A lecturer can see all the rankings he has made for a particular course
  @ManyToOne(() => User, (user) => user.rankings)
  user: User;

  @ManyToOne(() => Application)
  application: Application;
}
