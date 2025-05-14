import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Application } from './Application';

export type UserRole = 'candidate' | 'lecturer' | 'admin';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

 @Column({
  type: 'enum',
  enum: ['candidate', 'lecturer', 'admin'], // ✅ these are valid values
})
role!: 'candidate' | 'lecturer' | 'admin';


  @Column()
  dateOfJoining!: Date;

  @Column({ nullable: true })
  avatarUrl?: string;

  @OneToMany(() => Application, (app) => app.candidate)
  applications!: Application[];
}
