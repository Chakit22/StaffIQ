import { InputType, ObjectType, Field } from "type-graphql";
import { Admin } from "../../entities/Admin";

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class AuthResponse {
  @Field()
  token: string;

  @Field(() => Admin)
  admin: Admin;
}

@ObjectType()
export class AdminResponse {
  @Field(() => Admin, { nullable: true })
  admin?: Admin;

  @Field({ nullable: true })
  error?: string;
}
