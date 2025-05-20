/**
 * Controller for candidate application
 * 1. Creating a application
 * 2. Getting all applications of a candidate
 */

import { NextFunction } from "express";
import { AppDataSource } from "../../data-source";
import { Application } from "../../entity/Application";
import { Request, Response } from "express";

export class ApplicationController {
  // Repository for application
  private applicationRepository = AppDataSource.getRepository(Application);

  // Create a application
  /**
   *
   * @param req express request object
   * @param res express response object
   * @returns the created application
   */
  async createApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const application = this.applicationRepository.create(req.body);
      await this.applicationRepository.save(application);
      res.status(201).json({
        success: true,
        body: application,
      });
    } catch (error) {
      next(error);
      return;
    }
  }
}
