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
import { Skills } from "./Skills";

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  // A application belongs to one user
  @ManyToOne(() => User, (user) => user.applications)
  user: User;

  // A application belongs to a particular course
  // If a course is deleted, all applications for that course will be deleted
  @ManyToOne(() => Course, (course) => course.applications, {
    onDelete: "CASCADE",
  })
  course: Course;

  // A application belongs to a particular role
  @ManyToOne(() => Role, (role) => role.applications)
  role: Role;

  @Column()
  academic_creds: string;

  @Column()
  availability: string;

  @Column()
  comments: string;

  @Column({ default: false })
  is_chosen: boolean;

  // Owning side of the many-to-many relationship, so JoinTable is added.(JoinTable is mandatory to be added)
  // A application can have many skills
  @ManyToMany(() => Skills)
  @JoinTable({ name: "ApplicationSkills" })
  skills: Skills[];
}
