import { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("errorHandler middleware");
  console.error(err.stack);

  // Default error status and message
  const status = err.statusCode || 500;
  const message = err.message || "Something went wrong!";

  res.status(status).json({
    success: false,
    body: null,
    message: message,
  });
};

export default errorHandler;
