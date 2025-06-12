import { InputType, ObjectType, Field, ID } from "type-graphql";
import { Course } from "../../entities/Course";

@InputType()
export class CreateCourseInput {
  @Field()
  name: string;

  @Field()
  course_code: string;
}

@InputType()
export class UpdateCourseInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  course_code?: string;
}

@InputType()
export class AssignLecturerInput {
  @Field(() => ID)
  lecturerId: string;

  @Field(() => [ID])
  courseIds: string[];
}

@ObjectType()
export class CourseResponse {
  @Field(() => Course, { nullable: true })
  course?: Course;

  @Field({ nullable: true })
  error?: string;
}

@ObjectType()
export class CourseListResponse {
  @Field(() => [Course])
  courses: Course[];

  @Field({ nullable: true })
  error?: string;
}
