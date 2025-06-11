import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export function validateSchema(
  schema: z.ZodSchema,
  source: "body" | "query" = "body"
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Convert req.body or req.query into a validated object
      const data = source === "body" ? req.body : req.query;
      const validatedData = schema.parse(data);

      // Replace original data with validated instance
      if (source === "body") {
        req.body = validatedData;
      } else {
        req.query = validatedData;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
