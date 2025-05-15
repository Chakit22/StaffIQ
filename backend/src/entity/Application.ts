import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { Role } from "./Role";
import { Course } from "./Course";

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.applications)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Course, (course) => course.applications)
  @JoinColumn({ name: "course_id" })
  course: Course;

  @ManyToOne(() => Role, (role) => role.applications)
  @JoinColumn({ name: "role_id" })
  role: Role;

  @Column()
  skills: string;

  @Column()
  academic_creds: string;

  @Column()
  availability: string;

  @Column()
  comments: string;

  @Column({ default: false })
  is_chosen: boolean;
}
