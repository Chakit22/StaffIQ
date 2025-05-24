import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";

export function validateDTO(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // plainToInstance() to convert req.body into a CreatePetDTO class instance
    const dtoObj = plainToInstance(dtoClass, req.body);
    console.log("dtoObj", dtoObj);
    const errors = await validate(dtoObj, { whitelist: true });
    console.log("errors", errors);

    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        body: null,
        message: "Invalid request body",
        errors: errors.map((e) => ({
          property: e.property,
          constraints: e.constraints,
        })),
      });
      return;
    }

    req.body = dtoObj; // Optional: replace body with a validated instance
    next();
  };
}
