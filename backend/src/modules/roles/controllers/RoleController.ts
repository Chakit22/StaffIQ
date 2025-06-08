import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../../../data-source";
import { Role } from "../../../entity/Role";

export class RoleController {
  // repository for role
  private roleRepository = AppDataSource.getRepository(Role);

  // Get all roles
  getAllRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roles = await this.roleRepository.find();
      res.status(200).json({
        success: true,
        body: roles,
        message: "Roles fetched succesfully!",
      });
    } catch (error) {
      next(error);
      return;
    }
  };
}
