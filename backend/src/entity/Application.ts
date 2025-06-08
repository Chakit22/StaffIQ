import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  JoinTable,
  ManyToMany,
} from "typeorm";
import { User } from "./User";
import { Role } from "./Role";
import { Course } from "./Course";
import { Skill } from "./Skill";
import { Availability } from "./Availability";

@Entity()
export class Application {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  academic_creds: string;

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
  @ManyToOne(() => Availability, (availability) => availability.applications)
  @JoinColumn({ name: "availabilityId" })
  availability: Availability;

  // Owning side of the many-to-many relationship, so JoinTable is added.(JoinTable is mandatory to be added)
  // A application can have many skills
  @ManyToMany(() => Skill)
  @JoinTable({ name: "ApplicationSkill" })
  skills: Skill[];
}
