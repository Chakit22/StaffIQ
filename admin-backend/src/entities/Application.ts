import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  JoinTable,
  ManyToMany,
  CreateDateColumn,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { User } from "./User";
import { Role } from "./Role";
import { Course } from "./Course";
import { Skill } from "./Skill";
import { Availability } from "./Availability";
import { Position } from "./Position";

@ObjectType()
@Entity()
export class Application {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  academic_creds: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  cover_letter: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", length: 500, nullable: true })
  resume_path: string | null;

  @Field()
  @Column({
    type: "enum",
    enum: ["applied", "under_review", "shortlisted", "interview", "offered", "accepted", "rejected"],
    default: "applied",
  })
  status: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  positionId: string | null;

  @Field()
  @CreateDateColumn()
  applied_at: Date;

  @Field()
  @Column()
  userId: string;

  @Field()
  @Column()
  courseId: string;

  @Field()
  @Column()
  roleId: string;

  @Field()
  @Column()
  availabilityId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.applications)
  @JoinColumn({ name: "userId" })
  user: User;

  @Field(() => Course)
  @ManyToOne(() => Course, (course) => course.applications, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "courseId" })
  course: Course;

  @Field(() => Role)
  @ManyToOne(() => Role, (role) => role.applications)
  @JoinColumn({ name: "roleId" })
  role: Role;

  @Field(() => Availability)
  @ManyToOne(() => Availability)
  @JoinColumn({ name: "availabilityId" })
  availability: Availability;

  @ManyToOne(() => Position, (position) => position.applications, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "positionId" })
  position: Position | null;

  @Field(() => [Skill])
  @ManyToMany(() => Skill)
  @JoinTable({
    name: "ApplicationSkill",
    joinColumn: {
      name: "applicationId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "skillName",
      referencedColumnName: "name",
    },
  })
  skills: Skill[];
}
