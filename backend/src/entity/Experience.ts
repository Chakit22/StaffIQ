import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Experience {
  @PrimaryGeneratedColumn()
  id: number;

  // An experience belongs to one user
  @ManyToOne(() => User, (user) => user.experiences)
  user: User;

  @Column()
  role: string;

  @Column()
  company_name: string;

  @Column()
  description: string;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;
}
