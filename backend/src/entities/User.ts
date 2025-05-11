import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Application } from './Application';

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

  @Column()
  role!: 'candidate' | 'lecturer' | 'admin';

  @Column()
  dateOfJoining!: Date;

  @Column({ nullable: true })
  avatarUrl?: string;

  @OneToMany(() => Application, (app) => app.candidate)
  applications!: Application[];
}
