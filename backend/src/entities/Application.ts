import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './User';
import { Course } from './Course';

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.applications)
  candidate!: User;

  @ManyToOne(() => Course, (course) => course.applications)
  course!: Course;

  @Column()
  appliedRole!: 'tutor' | 'lab_assistant';

  @Column()
  availability!: 'part-time' | 'full-time';

  @Column({ type: 'text' })
  skills!: string;

  @Column({ type: 'text' })
  academicCredentials!: string;

  @Column({ default: 'pending' })
  status!: 'pending' | 'accepted' | 'rejected';

  @CreateDateColumn()
  createdAt!: Date;
}
