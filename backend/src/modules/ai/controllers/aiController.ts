import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../../../data-source";
import { Application } from "../../../entity/Application";
import { Experience } from "../../../entity/Experience";
import Ranking from "../../../entity/Ranking";
import { GeminiService } from "../../../shared/services/gemini.service";
import { ApiError } from "../../../shared/middleware/error-handler";
import { AuthRequest } from "../../../shared/middleware/auth.middleware";
import * as fs from "fs";
import * as path from "path";

/**
 * Read a PDF file and return it as a Gemini-compatible inline data part.
 * Gemini vision can read image-based and text-based PDFs.
 */
function getResumeParts(resumePath: string | null): { inlineData: { mimeType: string; data: string } }[] {
  if (!resumePath) return [];
  const filePath = path.join(__dirname, "../../../../uploads/resumes", resumePath);
  if (!fs.existsSync(filePath)) return [];
  const buffer = fs.readFileSync(filePath);
  return [{
    inlineData: {
      mimeType: "application/pdf",
      data: buffer.toString("base64"),
    },
  }];
}

export class AIController {
  private applicationRepository = AppDataSource.getRepository(Application);
  private experienceRepository = AppDataSource.getRepository(Experience);
  private rankingRepository = AppDataSource.getRepository(Ranking);
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

      // Get resume PDF parts for Gemini vision
      const resumeParts = getResumeParts(application.resume_path);

      const promptText = `You are evaluating a candidate for the role of "${application.role.name}" in the course "${application.course.name}".

Write a concise 3-4 sentence professional assessment. Base your assessment PRIMARILY on the attached resume PDF (if provided). Only use the structured data below as supplementary context.

Structured Data:
- Name: ${application.user.name}
- Academic Credentials: ${application.academic_creds}
- Skills listed in application: ${application.skills.map((s) => s.name).join(", ") || "None listed"}
- Availability: ${application.availability.availability}
${application.cover_letter ? `- Cover Letter: ${application.cover_letter.substring(0, 500)}` : ""}
${resumeParts.length > 0 ? "- Resume: [attached as PDF below — read it visually and base your assessment on its actual content]" : "- Resume: Not uploaded"}

Cover: relevant skills, experience fit, availability, and overall suitability. Be honest — if the resume is unrelated to the course, say so clearly.`;

      const parts = [
        { text: promptText },
        ...resumeParts,
      ];
      const summary = await this.geminiService.generateWithParts(parts);

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

  /**
   * POST /api/ai/resume-insights
   * Analyzes a candidate's resume against successful candidates for the same course
   */
  getResumeInsights = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { applicationId } = req.body;
      const authReq = req as AuthRequest;

      if (!applicationId) {
        const error = new Error("applicationId is required") as ApiError;
        error.statusCode = 400;
        throw error;
      }

      // Fetch the candidate's application
      const application = await this.applicationRepository.findOne({
        where: { id: applicationId },
        relations: ["user", "course", "role", "availability", "skills"],
      });

      if (!application) {
        const error = new Error("Application not found") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // Verify ownership
      if (application.userId !== authReq.user?.id) {
        const error = new Error("Not authorized") as ApiError;
        error.statusCode = 403;
        throw error;
      }

      // Get resume file parts for Gemini vision
      const resumeParts = getResumeParts(application.resume_path);

      if (resumeParts.length === 0 && !application.cover_letter) {
        const error = new Error(
          "No resume or cover letter found. Upload a resume first.",
        ) as ApiError;
        error.statusCode = 400;
        throw error;
      }

      // Find top-ranked applications for the same course (exclude the candidate's own)
      const rankings = await this.rankingRepository.find({
        where: { application: { courseId: application.courseId } },
        relations: [
          "application",
          "application.user",
          "application.skills",
          "application.role",
        ],
        order: { rank: "ASC" },
        take: 10,
      });

      // Filter out the candidate's own application from rankings
      const otherRankings = rankings.filter(
        (r) => r.application.userId !== application.userId,
      );

      // If no other candidates have been ranked, return early
      if (otherRankings.length === 0) {
        res.status(200).json({
          success: true,
          body: {
            score: null,
            strengths: [],
            gaps: [],
            suggestions: [
              "No other candidates have been ranked for this course yet. Check back later once lecturers have reviewed applications — AI insights will compare your profile against top-ranked candidates.",
            ],
            noData: true,
          },
          message: "Not enough data for comparison yet",
        });
        return;
      }

      // Build successful candidates' profiles
      const successfulProfiles = await Promise.all(
        otherRankings.map(async (r) => {
          const exp = await this.experienceRepository.find({
            where: { user: { id: r.application.userId } },
          });
          return {
            name: r.application.user.name,
            rank: r.rank,
            role: r.application.role.name,
            skills: r.application.skills.map((s) => s.name),
            academicCreds: r.application.academic_creds,
            experience: exp.map(
              (e) => `${e.role} at ${e.company_name}: ${e.description}`,
            ),
          };
        }),
      );

      const successfulProfilesText = successfulProfiles.length > 0
        ? successfulProfiles
            .map(
              (p) =>
                `- ${p.name} (Rank #${p.rank}, ${p.role}): Skills: ${p.skills.join(", ")}. Creds: ${p.academicCreds}. Experience: ${p.experience.join("; ") || "None"}`,
            )
            .join("\n")
        : "No candidates have been ranked yet for this course.";

      const promptText = `You are a STRICT and critical career advisor. Your job is to honestly evaluate how well a candidate's resume matches the requirements for a teaching role. Do NOT inflate scores. Be brutally honest.

SCORING RULES (follow exactly):
- 0-20: Resume is completely unrelated to the course/role (e.g., a chef applying for a programming tutor role)
- 21-40: Resume shows some generic transferable skills but lacks domain-specific knowledge for this course
- 41-60: Resume has some relevant skills but significant gaps compared to successful candidates
- 61-75: Resume is a decent match with most required skills but missing some key experience
- 76-90: Strong match with most skills and relevant experience comparable to top candidates
- 91-100: Exceptional match equal to or better than the top-ranked candidates

If the resume/PDF is clearly unrelated to the course "${application.course.name}" or the role "${application.role.name}", the score MUST be below 30. Do not give benefit of the doubt.

CANDIDATE'S APPLICATION:
- Course: ${application.course.name}
- Role applied: ${application.role.name}
- Skills listed: ${application.skills.map((s) => s.name).join(", ") || "None"}
- Academic Credentials: ${application.academic_creds}
${application.cover_letter ? `- Cover Letter:\n${application.cover_letter.substring(0, 1000)}` : ""}
${resumeParts.length > 0 ? "- Resume: [attached as PDF below — read it visually]" : "- Resume: Not uploaded"}

SUCCESSFUL CANDIDATES (ranked by lecturers for the same course):
${successfulProfilesText}

Provide your analysis as a JSON object with EXACTLY these fields (no markdown, no code blocks):
{
  "score": <number 0-100 using the scoring rules above>,
  "strengths": [<array of 2-4 strings: specific skills/experience that genuinely match. If nothing matches say "No relevant strengths identified">],
  "gaps": [<array of 2-4 strings: specific skills/experience the successful candidates have that this candidate clearly lacks>],
  "suggestions": [<array of 2-4 strings: specific actionable improvements, not generic advice>]
}`;

      // Send prompt + PDF to Gemini vision
      const parts = [
        { text: promptText },
        ...resumeParts,
      ];
      const responseText = await this.geminiService.generateWithParts(parts);

      let insights;
      try {
        const cleaned = responseText
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();
        insights = JSON.parse(cleaned);
      } catch {
        insights = {
          score: 50,
          strengths: ["Unable to parse detailed analysis"],
          gaps: ["AI analysis format error — try again"],
          suggestions: ["Ensure your resume is well-formatted and try again"],
        };
      }

      res.status(200).json({
        success: true,
        body: insights,
        message: "Resume insights generated successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
