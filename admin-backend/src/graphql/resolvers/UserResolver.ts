import { Resolver, Query, Mutation, Arg, ID } from "type-graphql";
import { User } from "../../entities/User";
import { AppDataSource } from "../../data-source";

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async getAllLecturers(): Promise<User[]> {
    const userRepository = AppDataSource.getRepository(User);
    return await userRepository.find({
      where: { role: "lecturer" },
      relations: ["courses", "experiences"],
    });
  }

  @Mutation(() => User)
  async blockUser(@Arg("userId", () => ID) userId: string): Promise<User> {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    user.access = false;
    return await userRepository.save(user);
  }

  @Mutation(() => User)
  async unblockUser(@Arg("userId", () => ID) userId: string): Promise<User> {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    user.access = true;
    return await userRepository.save(user);
  }

  @Query(() => User)
  async getUser(@Arg("userId", () => ID) userId: string): Promise<User> {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ["applications", "experiences", "courses"],
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}
