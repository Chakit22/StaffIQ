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
    // Hardcoded admin credentials as per requirement
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "admin";

    if (
      input.username !== ADMIN_USERNAME ||
      input.password !== ADMIN_PASSWORD
    ) {
      throw new Error("Invalid credentials");
    }

    // Get or create admin user
    const adminRepository = AppDataSource.getRepository(Admin);
    let admin = await adminRepository.findOne({
      where: { username: ADMIN_USERNAME },
    });

    if (!admin) {
      // Create default admin if doesn't exist
      admin = adminRepository.create({
        username: ADMIN_USERNAME,
        password: ADMIN_PASSWORD, // In production, this should be hashed
      });
      admin = await adminRepository.save(admin);
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
