import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Application } from './Application';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  code!: string;

  @Column()
  name!: string;

  @OneToMany(() => Application, (app) => app.course)
  applications!: Application[];
}
