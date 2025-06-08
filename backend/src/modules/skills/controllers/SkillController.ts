import { Request, Response, NextFunction } from "express";
import { Skill } from "../../../entity/Skill";
import { AppDataSource } from "../../../data-source";

export class SkillController {
  private skillRepository = AppDataSource.getRepository(Skill);

  // Get all skills
  async getAllSkills(req: Request, res: Response, next: NextFunction) {
    try {
      const skills = await this.skillRepository.find();
      res.status(200).json({
        success: true,
        message: "Skills fetched succesfully!",
        body: skills,
      });
    } catch (error) {
      next(error);
      return;
    }
  }
}
