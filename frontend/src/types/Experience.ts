export interface Experience {
  id: string;
  role: string;
  company_name: string;
  description: string;
  start_date: Date;
  end_date?: Date;
}

// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   JoinColumn,
//   ManyToOne,
// } from "typeorm";
// import { User } from "./User";

// @Entity()
// export class Experience {
//   @PrimaryGeneratedColumn("uuid")
//   id: string;

//   @Column()
//   role: string;

//   @Column()
//   company_name: string;

//   @Column()
//   description: string;

//   @Column()
//   start_date: Date;

//   // End date is optional as it is not required for all experiences. The applicant can be in the current role.
//   @Column({ nullable: true })
//   end_date?: Date;

//   // An experience belongs to one user (owning side of the relation)
//   @ManyToOne(() => User, (user) => user.experiences)
//   @JoinColumn({ name: "userId" })
//   user: User;
// }
