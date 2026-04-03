import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: string = "gemini-2.5-flash-lite";

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  async generateContent(prompt: string): Promise<string> {
    if (!this.genAI) {
      throw new Error(
        "GEMINI_API_KEY environment variable is required. Add it to your .env file.",
      );
    }
    const model = this.genAI.getGenerativeModel({ model: this.model });

    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        return response.text();
      } catch (error: any) {
        if (attempt === maxRetries) {
          throw new Error(
            `Gemini API call failed after ${maxRetries} attempts: ${error.message}`,
          );
        }
        // Wait before retrying (exponential backoff)
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)),
        );
      }
    }

    throw new Error("Gemini API call failed unexpectedly");
  }
}
