import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";

export function validateDTO(dtoClass: any, source: "body" | "query" = "body") {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Convert req.body or req.query into a DTO class instance
      const data = source === "body" ? req.body : req.query;
      console.log("data ", data);
      const dtoObj = plainToInstance(dtoClass, data);
      console.log("dtoObj ", dtoObj);
      const errors = await validate(dtoObj, { whitelist: true });

      if (errors.length > 0) {
        res.status(400).json({
          success: false,
          body: null,
          message: `Invalid request ${source}`,
          errors: errors.map((e) => ({
            property: e.property,
            constraints: e.constraints,
          })),
        });
        return;
      }

      // Replace original data with validated instance
      if (source === "body") {
        req.body = dtoObj;
      } else {
        req.query = dtoObj as any;
      }
      next();
    } catch (error) {
      console.log("error ", error);
      next(error);
    }
  };
}
