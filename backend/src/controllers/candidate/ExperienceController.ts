import { AppDataSource } from "../../data-source";
import { User } from "../../entity/User";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../middleware/error-handler";

export class ExperienceController {
  // Repository for user
  private userRepository = AppDataSource.getRepository(User);

  // Get all experiences/previous roles of a candidate
  /**
   *
   * @param req express request object
   * @param res express response object
   * @returns all experiences/previous roles of a candidate
   */
  getAllExperiences = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.params.userId;
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ["experiences"],
      });

      // The above condition returns null if the user does not exist
      if (!user) {
        const error = new Error("User does not exist!") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({
        success: true,
        body: user.experiences,
      });
    } catch (error) {
      next(error);
      return;
    }
  };
}
