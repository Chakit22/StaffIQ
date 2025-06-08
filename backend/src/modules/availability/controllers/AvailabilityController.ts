import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../../../data-source";
import { Availability } from "../../../entity/Availability";

export class AvailabilityController {
  private availabilityRepository = AppDataSource.getRepository(Availability);

  // Get all availabilities
  getAllAvailabilities = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const availabilities = await this.availabilityRepository.find();
      res.status(200).json({
        success: true,
        message: "Availabilities fetched successfully!",
        body: availabilities,
      });
    } catch (error) {
      next(error);
      return;
    }
  };
}
