import { ObjectType, Field, InputType } from "type-graphql";
import { Admin } from "../../entities/Admin";

@ObjectType()
export class AuthResponse {
  @Field()
  token: string;

  @Field(() => Admin)
  admin: Admin;
}

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class RegisterInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;
}
