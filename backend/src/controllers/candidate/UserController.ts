/*
    Controller for candidate profile 
    1. Getting user profile information
    2. Updating user profile information
    3. Getting all previous roles/experiences of a user
*/

import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { User } from "../../entity/User";

export class UserController {
  // Repository for user
  private userRepository = AppDataSource.getRepository(User);

  // Get all experiences/previous roles of a candidate
  /**
   *
   * @param req express request object
   * @param res express response object
   * @returns all experiences/previous roles of a candidate
   */
  async getAllExperiences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      // The above condition returns null if the user does not exist
      if (!user) {
        throw new Error("User does not exist!");
      }

      res.status(200).json({
        success: true,
        body: user.experiences,
      });
    } catch (error) {
      next(error);
      return;
    }
  }

  // Get details of a user
  /**
   *
   * @param req express request object
   * @param res express response object
   * @returns details of a user
   */
  async getUserDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new Error("User does not exist!");
      }

      res.status(200).json({
        success: true,
        body: user,
      });
    } catch (error) {
      next(error);
      return;
    }
  }

  // // Update the Avatar of a user
  // /**
  //  *
  //  * @param req express request object
  //  * @param res express response object
  //  * @returns updated user details
  //  */
  // async updateUserAvatar(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const userId = req.params.userId;
  //     const user = await this.userRepository.findOne({
  //       where: { id: userId },
  //     });
  //     if (!user) {
  //       throw new Error("User not found");
  //     }
  //     const updatedUser = this.userRepository.merge(user, req.body);
  //     await this.userRepository.save(updatedUser);
  //     res.status(200).json({
  //       success: true,
  //       body: updatedUser,
  //     });
  //   } catch (error) {
  //     next(error);
  //     return;
  //   }
  // }

  // Get all applications of a candidate
  /**
   *
   * @param req express request object
   * @param res express response object
   * @returns all applications of a candidate
   */
  async getAllApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new Error("User does not exist!");
      }

      res.status(200).json({
        success: true,
        body: user.applications,
      });
    } catch (error) {
      next(error);
      return;
    }
  }
}
