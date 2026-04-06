import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { User } from "./User";

@ObjectType()
@Entity()
export class Experience {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  role: string;

  @Field()
  @Column()
  company_name: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column()
  start_date: Date;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  end_date?: Date;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.experiences)
  @JoinColumn({ name: "userId" })
  user: User;
}
