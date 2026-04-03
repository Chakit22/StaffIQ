import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../../../data-source";
import { Application } from "../../../entity/Application";
import { Experience } from "../../../entity/Experience";
import { GeminiService } from "../../../shared/services/gemini.service";
import { ApiError } from "../../../shared/middleware/error-handler";

export class AIController {
  private applicationRepository = AppDataSource.getRepository(Application);
  private experienceRepository = AppDataSource.getRepository(Experience);
  private geminiService = new GeminiService();

  /**
   * POST /api/ai/candidate-summary
   * Generates an AI summary for a candidate's application
   */
  getCandidateSummary = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { applicationId } = req.body;

      if (!applicationId) {
        const error = new Error("applicationId is required") as ApiError;
        error.statusCode = 400;
        throw error;
      }

      // Fetch the application with all relations
      const application = await this.applicationRepository.findOne({
        where: { id: applicationId },
        relations: [
          "user",
          "course",
          "role",
          "availability",
          "skills",
        ],
      });

      if (!application) {
        const error = new Error("Application not found") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // Fetch user experiences
      const experiences = await this.experienceRepository.find({
        where: { user: { id: application.userId } },
      });

      // Build candidate data for the prompt
      const candidateData = {
        name: application.user.name,
        email: application.user.email,
        course: application.course.name,
        role: application.role.name,
        availability: application.availability.availability,
        academicCredentials: application.academic_creds,
        skills: application.skills.map((s) => s.name),
        experiences: experiences.map((exp) => ({
          role: exp.role,
          company: exp.company_name,
          description: exp.description,
          startDate: exp.start_date,
          endDate: exp.end_date || "Present",
        })),
      };

      const prompt = `Given this candidate's profile for the role of "${application.role.name}" in the course "${application.course.name}", write a concise 3-4 sentence assessment covering: relevant skills, experience fit, availability, and overall suitability.

Candidate Data:
- Name: ${candidateData.name}
- Academic Credentials: ${candidateData.academicCredentials}
- Skills: ${candidateData.skills.join(", ") || "None listed"}
- Availability: ${candidateData.availability}
- Experience: ${
        candidateData.experiences.length > 0
          ? candidateData.experiences
              .map(
                (exp) =>
                  `${exp.role} at ${exp.company} (${exp.startDate} - ${exp.endDate}): ${exp.description}`,
              )
              .join("; ")
          : "No prior experience listed"
      }

Provide a professional, objective assessment.`;

      const summary = await this.geminiService.generateContent(prompt);

      res.status(200).json({
        success: true,
        body: { summary },
        message: "Candidate summary generated successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/ai/ranking-suggestion
   * Generates AI-suggested rankings for a set of candidates
   */
  getRankingSuggestion = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { courseId, applicationIds } = req.body;

      if (!courseId || !applicationIds || !Array.isArray(applicationIds)) {
        const error = new Error(
          "courseId and applicationIds[] are required",
        ) as ApiError;
        error.statusCode = 400;
        throw error;
      }

      if (applicationIds.length === 0) {
        const error = new Error(
          "At least one applicationId is required",
        ) as ApiError;
        error.statusCode = 400;
        throw error;
      }

      // Fetch all applications with full relations
      const applications = await this.applicationRepository.find({
        where: applicationIds.map((id: string) => ({ id })),
        relations: [
          "user",
          "course",
          "role",
          "availability",
          "skills",
        ],
      });

      if (applications.length === 0) {
        const error = new Error("No applications found") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // Fetch experiences for all candidates
      const candidatesData = await Promise.all(
        applications.map(async (app) => {
          const experiences = await this.experienceRepository.find({
            where: { user: { id: app.userId } },
          });

          return {
            applicationId: app.id,
            name: app.user.name,
            course: app.course.name,
            role: app.role.name,
            availability: app.availability.availability,
            academicCredentials: app.academic_creds,
            skills: app.skills.map((s) => s.name),
            experiences: experiences.map((exp) => ({
              role: exp.role,
              company: exp.company_name,
              description: exp.description,
            })),
          };
        }),
      );

      const courseName = applications[0].course.name;
      const roleName = applications[0].role.name;

      const prompt = `Rank these ${candidatesData.length} candidates for the course "${courseName}" as "${roleName}". For each candidate provide: suggested rank and a one-line reason. Consider: skills relevance, experience, availability, academic background.

Candidates:
${candidatesData
  .map(
    (c, i) => `${i + 1}. ${c.name} (ID: ${c.applicationId})
   - Skills: ${c.skills.join(", ") || "None"}
   - Availability: ${c.availability}
   - Academic Credentials: ${c.academicCredentials}
   - Experience: ${
     c.experiences.length > 0
       ? c.experiences.map((e) => `${e.role} at ${e.company}`).join("; ")
       : "None"
   }`,
  )
  .join("\n")}

Return ONLY a valid JSON array with no markdown formatting, no code blocks, no extra text. Each element must have these exact keys: "applicationId" (string), "suggestedRank" (number starting from 1), "reason" (string, one line).`;

      const responseText = await this.geminiService.generateContent(prompt);

      // Parse the JSON response from Gemini
      let suggestions;
      try {
        // Clean up potential markdown code blocks
        const cleanedResponse = responseText
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();
        suggestions = JSON.parse(cleanedResponse);
      } catch {
        // If JSON parsing fails, return a fallback
        suggestions = applicationIds.map((id: string, index: number) => ({
          applicationId: id,
          suggestedRank: index + 1,
          reason: "AI ranking unavailable - using current order",
        }));
      }

      res.status(200).json({
        success: true,
        body: { suggestions },
        message: "Ranking suggestions generated successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
