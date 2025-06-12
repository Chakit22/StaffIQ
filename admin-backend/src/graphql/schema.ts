import { buildSchema } from "type-graphql";
import { AuthResolver } from "./resolvers/AuthResolver";
import { UserResolver } from "./resolvers/UserResolver";
import { CourseResolver } from "./resolvers/CourseResolver";
import { ReportResolver } from "./resolvers/ReportResolver";

export async function createSchema() {
  return await buildSchema({
    resolvers: [AuthResolver, UserResolver, CourseResolver, ReportResolver],
    validate: false,
  });
}
