import { ObjectType, Field, ID } from "type-graphql";
import { User } from "../../entities/User";
import { Course } from "../../entities/Course";

@ObjectType()
export class CourseWithCandidates {
  @Field(() => Course)
  course: Course;

  @Field(() => [User])
  candidates: User[];

  @Field()
  candidateCount: number;
}

@ObjectType()
export class CandidateWithCourseCount {
  @Field(() => User)
  candidate: User;

  @Field()
  courseCount: number;

  @Field(() => [Course])
  courses: Course[];
}

@ObjectType()
export class UnselectedCandidate {
  @Field(() => User)
  candidate: User;

  @Field()
  applicationCount: number;
}
