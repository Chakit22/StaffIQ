import { InputType, ObjectType, Field, ID, Int } from "type-graphql";
import { Position } from "../../entities/Position";

@InputType()
export class CreatePositionInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => ID)
  courseId: string;

  @Field(() => ID)
  roleId: string;

  @Field({ nullable: true })
  requirements?: string;

  @Field(() => Int)
  positions_available: number;

  @Field()
  deadline: string;

  @Field(() => ID)
  created_by: string;
}

@InputType()
export class UpdatePositionInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  requirements?: string;

  @Field(() => Int, { nullable: true })
  positions_available?: number;

  @Field({ nullable: true })
  deadline?: string;

  @Field({ nullable: true })
  status?: string;
}

@ObjectType()
export class PositionResponse {
  @Field(() => Position, { nullable: true })
  position?: Position;

  @Field({ nullable: true })
  error?: string;
}

@ObjectType()
export class PositionListResponse {
  @Field(() => [Position])
  positions: Position[];

  @Field({ nullable: true })
  error?: string;
}
