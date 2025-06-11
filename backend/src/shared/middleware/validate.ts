import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export function validateSchema(
  schema: z.ZodSchema,
  source: "body" | "query" = "body"
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get data from the appropriate source
      const data = source === "body" ? req.body : req.query;

      // Use safeParse to get better error handling
      const result = schema.safeParse(data);

      if (!result.success) {
        // Handle Zod validation errors
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: result.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
            code: issue.code,
          })),
        });
        return;
      }

      // Replace original data with validated instance
      if (source === "body") {
        req.body = result.data;
      } else {
        // For query parameters, add a new property since req.query is read-only
        (req as any).validatedQuery = result.data;
      }

      next();
    } catch (error) {
      // Check if it's a ZodError
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
            code: issue.code,
          })),
        });
        return;
      }

      // Pass other errors to the error handler
      next(error);
    }
  };
}
