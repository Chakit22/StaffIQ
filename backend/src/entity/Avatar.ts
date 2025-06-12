// Entity for the avatar
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { User } from "./User";

// An avatar belong to many users
@Entity()
export class Avatar {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true, default: "defaultUrl" })
  url: string;

  // An avatar can have many users
  @OneToMany(() => User, (user) => user.avatar)
  users: User[];
}
