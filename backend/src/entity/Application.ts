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
import { User } from "./User";
import { Role } from "./Role";
import { Course } from "./Course";
import { Skill } from "./Skill";
import { Availability } from "./Availability";
import { Position } from "./Position";

@Entity()
export class Application {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  academic_creds: string;

  @Column({ type: "text", nullable: true })
  cover_letter: string | null;

  @Column({ type: "varchar", length: 500, nullable: true })
  resume_path: string | null;

  @Column({
    type: "enum",
    enum: ["applied", "under_review", "shortlisted", "interview", "offered", "accepted", "rejected"],
    default: "applied",
  })
  status: "applied" | "under_review" | "shortlisted" | "interview" | "offered" | "accepted" | "rejected";

  @Column({ nullable: true })
  positionId: string | null;

  @CreateDateColumn()
  applied_at: Date;

  // Define foreign keys as a seperate columns for easy query access
  @Column()
  userId: string;

  @Column()
  courseId: string;

  @Column()
  roleId: string;

  @Column()
  availabilityId: string;

  // Define relations
  // A application belongs to one user (owning side of the relation)
  /**
   * Note: userId would not be defined as a seperate column in the case of TypeORM but instead it will just define
   * the relationship with the primary key 'id'. If you want to add a seperate column then you need to write @Column() userId: number;
   */
  @ManyToOne(() => User, (user) => user.applications)
  @JoinColumn({ name: "userId" })
  user: User;

  // A application belongs to a particular course (owning side of the relation)
  // If a course is deleted, all applications for that course will be deleted
  @ManyToOne(() => Course, (course) => course.applications, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "courseId" })
  course: Course;

  // A application belongs to a particular role (owning side of the relation)
  @ManyToOne(() => Role, (role) => role.applications)
  @JoinColumn({ name: "roleId" })
  role: Role;

  // A applicant will have a single availability but many applicants can have the same availability
  @ManyToOne(() => Availability)
  @JoinColumn({ name: "availabilityId" })
  availability: Availability;

  // Position (nullable for backward compat)
  @ManyToOne(() => Position, (position) => position.applications, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "positionId" })
  position: Position | null;

  // Owning side of the many-to-many relationship
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
