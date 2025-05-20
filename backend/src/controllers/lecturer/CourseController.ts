import { AppDataSource } from "../../data-source";
import { Application } from "../../entity/Application";
import { Course } from "../../entity/Course";
import Ranking from "../../entity/Ranking";
import { User } from "../../entity/User";

export class CourseController {
  // repository for course
  private courseRepository = AppDataSource.getRepository(Course);

  // repository for application
  private applicationRepository = AppDataSource.getRepository(Application);

  // repository for ranking
  private rankingRepository = AppDataSource.getRepository(Ranking);

  // repository for user
  private userRepository = AppDataSource.getRepository(User);

  // Get all applications for a course
  getAllApplications = async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const applications = await this.applicationRepository.find({
      where: { courseId },
    });
  };
}
