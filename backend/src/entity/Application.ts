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

  @Column()
  academic_creds: string;

  @Column()
  availability: string;

  @Column()
  comments: string;

  @Column({ default: false })
  is_chosen: boolean;

  // Define relations
  // A application belongs to one user (owning side of the relation)
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

  // Owning side of the many-to-many relationship, so JoinTable is added.(JoinTable is mandatory to be added)
  // A application can have many skills
  @ManyToMany(() => Skills)
  @JoinTable({ name: "ApplicationSkills" })
  skills: Skills[];
}
