import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";

export function validateDTO(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // plainToInstance() to convert req.body into a CreatePetDTO class instance
    const dtoObj = plainToInstance(dtoClass, req.body);
    console.log("dtoObj", dtoObj);
    /**
     * When whitelist: true is set, any property in the object that does NOT have a validation decorator will be automatically removed during validation.
     * {
        "username": "johndoe",
        "isAdmin": true,
        "token": "malicious_payload"
        }
        If isAdmin and token do not have any validation decorators, they will be removed during validation.
        and the request payload would be
        {
            "username": "johndoe"
        }
     * 
    */
    const errors = await validate(dtoObj, { whitelist: true });

    if (errors.length > 0) {
      res.status(400).json({
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
