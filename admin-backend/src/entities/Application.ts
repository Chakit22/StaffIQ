import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  JoinTable,
  ManyToMany,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { User } from "./User";
import { Role } from "./Role";
import { Course } from "./Course";
import { Skill } from "./Skill";
import { Availability } from "./Availability";

@ObjectType()
@Entity()
export class Application {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  academic_creds: string;

  @Field()
  @Column()
  userId: string;

  @Field()
  @Column()
  courseId: string;

  @Field()
  @Column()
  roleId: string;

  @Field()
  @Column()
  availabilityId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.applications)
  @JoinColumn({ name: "userId" })
  user: User;

  @Field(() => Course)
  @ManyToOne(() => Course, (course) => course.applications, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "courseId" })
  course: Course;

  @Field(() => Role)
  @ManyToOne(() => Role, (role) => role.applications)
  @JoinColumn({ name: "roleId" })
  role: Role;

  @Field(() => Availability)
  @ManyToOne(() => Availability)
  @JoinColumn({ name: "availabilityId" })
  availability: Availability;

  @Field(() => [Skill])
  @ManyToMany(() => Skill)
  @JoinTable({
    name: "ApplicationSkill",
    joinColumn: {
      name: "applicationId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "skillName",
      referencedColumnName: "name",
    },
  })
  skills: Skill[];
}
