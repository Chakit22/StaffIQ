// This is the entity for the comment on an application

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
} from "typeorm";
import { Application } from "./Application";
import { User } from "./User";

@Entity()
export class Comment {
  @PrimaryColumn("uuid")
  lecturerId: string;

  @PrimaryColumn("uuid")
  applicationId: string;

  @Column("text")
  comment: string;

  // Define relations

  @ManyToOne(() => User)
  @JoinColumn({ name: "lecturerId" })
  lecturer: User;

  // if an application is deleted (because a course is deleted) then all the records in the Comment table for that application will be deleted.
  @ManyToOne(() => Application, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "applicationId" })
  application: Application;
}
