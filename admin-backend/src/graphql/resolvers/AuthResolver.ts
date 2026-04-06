import { Resolver, Mutation, Arg, Query, Ctx } from "type-graphql";
import { LoginInput, AuthResponse, AdminResponse } from "../types/AuthTypes";
import { Admin } from "../../entities/Admin";
import { AuthService } from "../../services/auth.service";
import { AppDataSource } from "../../data-source";

interface Context {
  user?: any;
}

@Resolver()
export class AuthResolver {
  private authService = new AuthService();

  @Mutation(() => AuthResponse)
  async adminLogin(@Arg("input") input: LoginInput): Promise<AuthResponse> {
    const adminRepository = AppDataSource.getRepository(Admin);
    const admin = await adminRepository.findOne({
      where: { username: input.username },
    });

    if (!admin || admin.password !== input.password) {
      throw new Error("Invalid credentials");
    }

    const token = this.authService.generateAccessToken(
      admin.id.toString(),
      admin.username,
      "ADMIN"
    );

    return {
      token,
      admin,
    };
  }

  @Query(() => AdminResponse)
  async me(@Ctx() ctx: Context): Promise<AdminResponse> {
    if (!ctx.user) {
      return { error: "Not authenticated" };
    }

    const adminRepository = AppDataSource.getRepository(Admin);
    const admin = await adminRepository.findOne({
      where: { id: ctx.user.userId },
    });

    if (!admin) {
      return { error: "Admin not found" };
    }

    return { admin };
  }
}
