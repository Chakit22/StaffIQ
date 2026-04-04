import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Course } from "./Course";
import { Role } from "./Role";
import { User } from "./User";
import { Application } from "./Application";

@ObjectType()
@Entity()
export class Position {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column({ type: "text" })
  description: string;

  @Field()
  @Column()
  courseId: string;

  @Field()
  @Column()
  roleId: string;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  requirements: string | null;

  @Field()
  @Column({ type: "int" })
  positions_available: number;

  @Field()
  @Column({ type: "date" })
  deadline: Date;

  @Field()
  @Column({
    type: "enum",
    enum: ["open", "closed", "filled"],
    default: "open",
  })
  status: string;

  @Field()
  @Column()
  created_by: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field(() => Course)
  @ManyToOne(() => Course, { onDelete: "CASCADE" })
  @JoinColumn({ name: "courseId" })
  course: Course;

  @Field(() => Role)
  @ManyToOne(() => Role)
  @JoinColumn({ name: "roleId" })
  role: Role;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by" })
  creator: User;

  @Field(() => [Application])
  @OneToMany(() => Application, (application) => application.position)
  applications: Application[];
}
