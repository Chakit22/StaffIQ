import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Course } from "./Course";
import { Role } from "./Role";
import { User } from "./User";
import { Application } from "./Application";

@Entity()
export class Position {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column()
  courseId: string;

  @Column()
  roleId: string;

  @Column({ type: "text", nullable: true })
  requirements: string | null;

  @Column({ type: "int" })
  positions_available: number;

  @Column({ type: "date" })
  deadline: Date;

  @Column({
    type: "enum",
    enum: ["open", "closed", "filled"],
    default: "open",
  })
  status: "open" | "closed" | "filled";

  @Column()
  created_by: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Course, { onDelete: "CASCADE" })
  @JoinColumn({ name: "courseId" })
  course: Course;

  @ManyToOne(() => Role)
  @JoinColumn({ name: "roleId" })
  role: Role;

  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by" })
  creator: User;

  @OneToMany(() => Application, (application) => application.position)
  applications: Application[];
}
